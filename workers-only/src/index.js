const MAX = 20 * 1024 * 1024;
const json = (x,status=200) => Response.json(x,{status});
async function telegram(env, method, body) {
  const r = await fetch("https://api.telegram.org/bot"+env.BOT_TOKEN+"/"+method,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data = await r.json();
  if (!r.ok || !data.ok) throw new Error("Telegram request failed");
  return data.result;
}
async function processUpdate(update,env,origin) {
  const m=update.message;
  if (!m || m.chat.type!=="private") return;
  const reply=text=>telegram(env,"sendMessage",{chat_id:m.chat.id,text});
  if (env.ALLOWED_USERS && !env.ALLOWED_USERS.split(/[,\s]+/).includes(String(m.from.id))) return;
  const f=m.document||m.video||m.audio||m.photo?.at(-1);
  if (!f) return reply("Send a file up to 20 MB to create a persistent download link. Only share files you have permission to distribute.");
  if (!f.file_size || f.file_size>MAX) return reply("Telegram Bot API download limit: 20 MB. This Workers-only version cannot import larger Telegram files.");
  const key=crypto.randomUUID();
  try {
    const info=await telegram(env,"getFile",{file_id:f.file_id});
    const response=await fetch("https://api.telegram.org/file/bot"+env.BOT_TOKEN+"/"+info.file_path);
    if (!response.ok) throw new Error("Download failed");
    const bytes=await response.arrayBuffer();
    if (bytes.byteLength!==f.file_size || bytes.byteLength>MAX) throw new Error("Invalid size");
    await env.FILES.put(key,bytes,{httpMetadata:{contentType:f.mime_type||"application/octet-stream"},customMetadata:{filename:f.file_name||"download",owner:String(m.from.id)}});
    await reply("Download: "+origin+"/f/"+key+"\nNo automatic expiry. Available while stored in R2.");
  } catch { await reply("Unable to store file. Please retry."); }
}
export default {async fetch(req,env,ctx){
  const url=new URL(req.url);
  if(url.pathname==="/webhook" && req.method==="POST"){
    if(!env.WEBHOOK_SECRET || req.headers.get("X-Telegram-Bot-Api-Secret-Token")!==env.WEBHOOK_SECRET) return json({error:"Forbidden"},403);
    let update;try{update=await req.json()}catch{return json({error:"Invalid JSON"},400)}
    ctx.waitUntil(processUpdate(update,env,url.origin).catch(()=>{}));
    return json({ok:true});
  }
  if(url.pathname==="/") return json({status:"active",telegramMaxBytes:MAX});
  const match=url.pathname.match(/^\/f\/([a-f0-9-]{36})$/);
  if(!match || !["GET","HEAD"].includes(req.method)) return new Response("Not found",{status:404});
  const meta=await env.FILES.head(match[1]);
  if(!meta)return new Response("Not found",{status:404});
  const headers=new Headers({"Accept-Ranges":"bytes","Cache-Control":"private, no-store","Content-Type":"application/octet-stream","Content-Disposition":"attachment; filename*=UTF-8''"+encodeURIComponent(meta.customMetadata?.filename||"download").replace(/['()*]/g,c=>"%"+c.charCodeAt(0).toString(16)),"X-Content-Type-Options":"nosniff"});
  let start=0,end=meta.size-1,status=200;
  const range=req.headers.get("Range");
  if(range && req.method==="GET"){
    const r=range.match(/^bytes=(\d*)-(\d*)$/);
    const invalid=()=>new Response(null,{status:416,headers:{"Content-Range":"bytes */"+meta.size}});
    if(!r||(!r[1]&&!r[2]))return invalid();
    if(!r[1]){start=Math.max(0,meta.size-Number(r[2]));}else{start=Number(r[1]);if(r[2])end=Math.min(end,Number(r[2]));}
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=meta.size)return invalid();
    status=206;headers.set("Content-Range","bytes "+start+"-"+end+"/"+meta.size);
  }
  headers.set("Content-Length",String(end-start+1));
  if(req.method==="HEAD")return new Response(null,{headers});
  const object=await env.FILES.get(match[1],status===206?{range:{offset:start,length:end-start+1}}:{});
  if(!object)return new Response("Not found",{status:404});
  return new Response(object.body,{status,headers});
}};
