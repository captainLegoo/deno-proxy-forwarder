# 🌐 Deno 代理转发器

一个轻量级的 HTTP 代理转发工具，部署在 [Deno Deploy](https://deno.com/deploy) 上。可根据 URL 自动识别目标主机并转发请求。

> 🌐 [English Documentation (English version)](./README.md)

---

## 🚀 部署到 Deno Deploy

要将本项目部署到 Deno Deploy，请按以下步骤操作：

1. 访问 [Deno Deploy 控制台](https://dash.deno.com/)
2. 点击 **“Deploy your own code”**
3. 选择你的 GitHub 账户，并选择仓库：`deno-proxy-forwarder`
4. 选择：
   - **构建模式（Build mode）**：`No build step`
   - **入口文件（Entry point）**：`main.ts`
5. 点击 **“Create & Deploy”** 完成部署

> ✅ 部署完成后你会获得一个公开的 URL，例如：`https://your-proxy.deno.dev`

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
