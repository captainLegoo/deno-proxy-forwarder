# 🌐 Deno 代理转发器

一个轻量级的 HTTP 代理转发工具，部署在 [Deno Deploy](https://deno.com/deploy) 上。可根据 URL 自动识别目标主机并转发请求。

> 🌐 [English Documentation (English version)](./README.md)

---

## 🚀 一键部署

点击下方按钮，使用你的 Deno Deploy 账户一键 Fork 并部署本项目：

[![Deploy to Deno](https://img.shields.io/badge/Deploy%20to-Deno%20Deploy-black?logo=deno&style=for-the-badge)](https://dash.deno.com/new?url=https://github.com/captainLegoo/deno-proxy-forwarder)

> ✅ 登录后即可部署，并获得一个 URL，例如：`https://your-proxy.deno.dev`

---

## 🧠 如何使用

示例：

https://your-proxy.deno.dev/api.openai.com/v1/chat/completions
 →
https://api.openai.com/v1/chat/completions

它会自动从路径中识别目标主机并转发请求。

---

## 🔐 安全建议

你可以在 `main.ts` 中添加白名单机制来限制代理目标主机，例如：

```ts
const WHITELIST = ["api.openai.com", "api.github.com"];
if (!WHITELIST.includes(hostname)) {
  return new Response("非法请求", { status: 403 });
}
