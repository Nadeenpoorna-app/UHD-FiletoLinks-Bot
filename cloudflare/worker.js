export default { async fetch(request, env) {
  if (!["GET","HEAD"].includes(request.method)) return new Response("Method not allowed",{status:405});
  const incoming = new URL(request.url);
  const origin = new URL(env.ORIGIN_URL);
  origin.pathname = incoming.pathname;
  origin.search = incoming.search;
  const headers = new Headers();
  for (const name of ["range","if-range","accept"]) {
    if (request.headers.has(name)) headers.set(name,request.headers.get(name));
  }
  try {
    const upstream = await fetch(origin, {method:request.method,headers,redirect:"manual",cf:{cacheTtl:0,cacheEverything:false}});
    const out = new Headers(upstream.headers);
    out.set("Cache-Control","private, no-store");
    return new Response(request.method==="HEAD"?null:upstream.body,{status:upstream.status,headers:out});
  } catch { return new Response("Backend unavailable; retry shortly.",{status:503,headers:{"Retry-After":"30"}}); }
}};
