const buckets = new Map<string,{count:number; reset:number}>();
export async function rateLimit(key:string,limit=5,windowMs=60_000){
  const now=Date.now(); const current=buckets.get(key);
  if(!current || current.reset<now){ buckets.set(key,{count:1,reset:now+windowMs}); return {ok:true,remaining:limit-1}; }
  if(current.count>=limit) return {ok:false,remaining:0};
  current.count++; return {ok:true,remaining:limit-current.count};
}
