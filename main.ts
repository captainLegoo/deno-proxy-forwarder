// main.ts
Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const { pathname, search } = new URL(req.url);
    const segments = pathname.slice(1).split("/");
    const hostname = segments.shift();
    const targetPath = segments.join("/");

    if (!hostname) {
      return new Response("Missing hostname in path", { status: 400 });
    }

    const targetUrl = `https://${hostname}/${targetPath}${search}`;

    const proxiedResponse = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? req.body
          : undefined,
    });

    const headers = new Headers(proxiedResponse.headers);
    headers.set("access-control-allow-origin", "*");

    return new Response(proxiedResponse.body, {
      status: proxiedResponse.status,
      headers,
    });
  } catch (err) {
    return new Response("Proxy failed: " + (err instanceof Error ? err.message : String(err)), {
      status: 502,
    });
  }
});
