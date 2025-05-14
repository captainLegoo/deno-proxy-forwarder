# 🌐 Deno Proxy Forwarder

A lightweight HTTP proxy forwarder powered by [Deno Deploy](https://deno.com/deploy). Automatically parses the destination host from the URL and forwards the request.

> 📖 [中文文档（中文说明）](./README.zh.md)

---

## 🚀 Deploy to Deno Deploy

To deploy this project to Deno Deploy:

1. Go to [Deno Deploy dashboard](https://dash.deno.com/)
2. Click **"Deploy your own code"**
3. Select your GitHub account and choose the `deno-proxy-forwarder` repo
4. Select:
   - **Build mode**: `No build step`
   - **Entry point**: `main.ts`
5. Click **"Create & Deploy"**

> ✅ After deployment, you'll get a public URL like: `https://your-proxy.deno.dev`

---

## 🧠 How to Use

Example:

https://your-proxy.deno.dev/api.openai.com/v1/chat/completions
 →
https://api.openai.com/v1/chat/completions

It automatically extracts the host from the path and proxies your request.

---

## 🔐 Security Advice

You can restrict target domains by adding a whitelist in `main.ts`:

```ts
const WHITELIST = ["api.openai.com", "api.github.com"];
if (!WHITELIST.includes(hostname)) {
  return new Response("Unauthorized target", { status: 403 });
}
```