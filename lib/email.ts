import {adminSupabase} from '@/lib/supabase';
export async function notifyBusiness(subject:string, html:string){
  const key=process.env.RESEND_API_KEY; if(!key) return {sent:false};
  let to=process.env.BUSINESS_EMAIL;
  if(!to){try{const {data}=await adminSupabase().from('settings').select('value').eq('key','business_email').maybeSingle();to=data?.value||undefined}catch{}}
  if(!to) return {sent:false};
  const from=process.env.RESEND_FROM_EMAIL||'OG Studios.Tech <onboarding@resend.dev>';
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject,html})});
  if(!res.ok) throw new Error('Email provider rejected the notification.');
  return {sent:true};
}
