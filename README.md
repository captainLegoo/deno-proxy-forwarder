# 🌐 Deno Proxy Forwarder

A lightweight HTTP proxy forwarder powered by [Deno Deploy](https://deno.com/deploy). Automatically parses the destination host from the URL and forwards the request.

> 📖 [中文文档（中文说明）](./README.zh.md)

---

## 🚀 One-Click Deploy

Click the button below to fork and deploy this project using your Deno Deploy account:

[![Deploy to Deno](https://img.shields.io/badge/Deploy%20to-Deno%20Deploy-black?logo=deno&style=for-the-badge)](https://dash.deno.com/new?url=https://github.com/captainLegoo/deno-proxy-forwarder)

> ✅ After deployment, you'll get your own proxy URL, like `https://your-proxy.deno.dev`.

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