export default async (req: Request): Promise<Response> => {
  const { pathname, search } = new URL(req.url);

  // Remove the leading slash and split the path
  const segments = pathname.slice(1).split("/");
  const hostname = segments.shift();
  const targetPath = segments.join("/");

  if (!hostname) {
    return new Response("Missing hostname in path", { status: 400 });
  }

  const targetUrl = `https://${hostname}/${targetPath}${search}`;

  try {
    const proxiedResponse = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : null,
    });

    const headers = new Headers(proxiedResponse.headers);
    headers.set("access-control-allow-origin", "*"); // Allow cross-domain

    return new Response(proxiedResponse.body, {
      status: proxiedResponse.status,
      headers,
    });
  } catch (err) {
    return new Response("Proxy failed: " + err.message, { status: 502 });
  }
};
