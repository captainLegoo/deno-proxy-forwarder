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

    const forwardHeaders = new Headers();
    const allowedHeaders = ['content-type', 'authorization', 'accept'];
    for (const [key, value] of req.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        forwardHeaders.set(key, value);
      }
    }

    const proxiedResponse = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? req.clone().body
          : undefined,
    });

    const headers = new Headers(proxiedResponse.headers);
    headers.set("access-control-allow-origin", "*");
    headers.set("access-control-allow-headers", "Content-Type, Authorization");
    headers.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    return new Response(proxiedResponse.body, {
      status: proxiedResponse.status,
      headers,
    });

  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Proxy failed: " + (err instanceof Error ? err.message : String(err)), {
      status: 502,
    });
  }
});
