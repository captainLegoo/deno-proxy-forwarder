# 🌐 Deno Proxy Forwarder

A lightweight HTTP proxy forwarder powered by [Deno Deploy](https://deno.com/deploy). Automatically parses the destination host from the URL and forwards the request.

> 📖 [中文文档（中文说明）](./README.zh.md)

---

### 🚀 Deploy to Deno Deploy

To deploy this project to Deno Deploy:

1. **Fork this repository** to your own GitHub account:

   > Click the top-right “Fork” button on this page.

2. Go to [Deno Deploy dashboard](https://dash.deno.com/)

3. Click **"Deploy your own code"**

4. Select your GitHub account and choose the forked `deno-proxy-forwarder` repo

5. Configure the deployment:

   - **Build mode:** `No build step`
   - **Entry point:** `main.ts`

6. Click **"Create & Deploy"**

✅ After deployment, you’ll get a public proxy URL, like: `https://your-proxy.deno.dev`

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