import {supabaseServer} from '@/lib/supabase-server';
export async function requireUser(){const supabase=await supabaseServer();const {data:{user}}=await supabase.auth.getUser(); if(!user) return {supabase,user:null}; const {data:admin}=await supabase.from('admins').select('user_id').eq('user_id',user.id).maybeSingle(); return {supabase,user:admin?user:null};}
