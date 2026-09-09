import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation';
import { adminSupabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { notifyBusiness } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = await rateLimit(`reg:${ip}`, 5, 60_000); if (!rl.ok) return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
    const body = await req.json(); if (body.website) return NextResponse.json({ ok: true });
    const parsed = registrationSchema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid form.' }, { status: 400 });
    const db = adminSupabase();
    const { data, error } = await db.rpc('register_for_workshop', { p_workshop_id: parsed.data.workshop_id, p_name: parsed.data.name, p_email: parsed.data.email, p_phone: parsed.data.phone, p_education_level: parsed.data.education_level, p_message: parsed.data.message || null });
    if (error) {
      const msg = error.message.includes('WORKSHOP_FULL') ? 'That workshop is full.' : error.message.includes('ALREADY_REGISTERED') ? 'This email is already registered for that workshop.' : error.message.includes('WORKSHOP_PAST') ? 'That workshop has already taken place.' : error.message.includes('WORKSHOP_NOT_OPEN') ? 'That workshop is no longer open.' : 'Registration could not be completed.';
      return NextResponse.json({ error: msg }, { status: msg === 'That workshop is full.' ? 409 : 400 });
    }
    const { data: workshop } = await db.from('workshops').select('title').eq('id', parsed.data.workshop_id).maybeSingle();
    if (workshop) await notifyBusiness(`Workshop registration: ${parsed.data.name}`, `<p>${parsed.data.name} registered for <strong>${workshop.title}</strong>.</p><p>${parsed.data.email} · ${parsed.data.phone}</p>`);
    return NextResponse.json({ ok: true, data });
  } catch (e) { console.error('registration POST failed', e); return NextResponse.json({ error: 'Registration could not be completed right now.' }, { status: 500 }); }
}
