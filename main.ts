const CACHE = new Map<string, { timestamp: number; response: Response }>();
const CACHE_TTL = 30_000; // Cache time: 30 seconds
const ALLOWED_HEADERS = new Set(['content-type', 'authorization', 'accept']);

// Periodically clean up expired cache (every minute)
setInterval(() => {
  const now = Date.now();
  for (const [key, { timestamp }] of CACHE.entries()) {
    if (now - timestamp > CACHE_TTL) {
      CACHE.delete(key);
    }
  }
}, 60_000);

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

    // OPTIONS Preflight Request
    if (req.method === "OPTIONS") {
      const corsHeaders = new Headers({
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "Content-Type, Authorization",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      });
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Cache Check (GET only)
    if (req.method === "GET") {
      const cached = CACHE.get(pathname + search);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.response.clone();
      }
    }

    // Forwarding request headers
    const forwardHeaders = new Headers();
    for (const [key, value] of req.headers.entries()) {
      if (ALLOWED_HEADERS.has(key.toLowerCase())) {
        forwardHeaders.set(key, value);
      }
    }

    // Proxy Request
    const proxiedResponse = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? req.clone().body
          : undefined,
    });

    // Constructing response headers (with CORS)
    const headers = new Headers(proxiedResponse.headers);
    headers.set("access-control-allow-origin", "*");
    headers.set("access-control-allow-headers", "Content-Type, Authorization");
    headers.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");

    // Write cache (GET + 200 only)
    if (req.method === "GET" && proxiedResponse.status === 200) {
      CACHE.set(pathname + search, {
        timestamp: Date.now(),
        response: proxiedResponse.clone(),
      });
    }

    return new Response(proxiedResponse.body, {
      status: proxiedResponse.status,
      headers,
    });

  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(
      "Proxy failed: " + (err instanceof Error ? err.message : String(err)),
      { status: 502 }
    );
  }
});
