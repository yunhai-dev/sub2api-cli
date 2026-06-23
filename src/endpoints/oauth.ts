import type { EndpointDef } from "../types.js";

export const openaiOAuthEndpoints: EndpointDef[] = [
  { domain: "openai", action: "generate-auth-url", method: "POST", path: "/admin/openai/generate-auth-url", rawBody: true, description: "生成 OpenAI OAuth 认证 URL" },
  { domain: "openai", action: "exchange-code", method: "POST", path: "/admin/openai/exchange-code", rawBody: true, description: "交换 OpenAI OAuth Code" },
  { domain: "openai", action: "refresh-token", method: "POST", path: "/admin/openai/refresh-token", rawBody: true, description: "刷新 OpenAI Token" },
  { domain: "openai", action: "refresh-account", method: "POST", path: "/admin/openai/accounts/:id/refresh", pathParams: [{ name: "id", type: "number", required: true, description: "账号 ID" }], description: "刷新 OpenAI 账号 Token" },
  { domain: "openai", action: "create-from-oauth", method: "POST", path: "/admin/openai/create-from-oauth", rawBody: true, description: "从 OAuth 创建 OpenAI 账号" },
  { domain: "openai", action: "query-quota", method: "GET", path: "/admin/openai/accounts/:id/quota", pathParams: [{ name: "id", type: "number", required: true, description: "账号 ID" }], description: "查询 OpenAI 账号配额" },
  { domain: "openai", action: "reset-quota", method: "POST", path: "/admin/openai/accounts/:id/reset-quota", pathParams: [{ name: "id", type: "number", required: true, description: "账号 ID" }], description: "重置 OpenAI 账号配额" },
];

export const geminiOAuthEndpoints: EndpointDef[] = [
  { domain: "gemini", action: "generate-auth-url", method: "POST", path: "/admin/gemini/oauth/auth-url", rawBody: true, description: "生成 Gemini OAuth 认证 URL" },
  { domain: "gemini", action: "exchange-code", method: "POST", path: "/admin/gemini/oauth/exchange-code", rawBody: true, description: "交换 Gemini OAuth Code" },
  { domain: "gemini", action: "capabilities", method: "GET", path: "/admin/gemini/oauth/capabilities", description: "获取 Gemini OAuth 能力" },
];

export const antigravityOAuthEndpoints: EndpointDef[] = [
  { domain: "antigravity", action: "generate-auth-url", method: "POST", path: "/admin/antigravity/oauth/auth-url", rawBody: true, description: "生成 Antigravity OAuth 认证 URL" },
  { domain: "antigravity", action: "exchange-code", method: "POST", path: "/admin/antigravity/oauth/exchange-code", rawBody: true, description: "交换 Antigravity OAuth Code" },
  { domain: "antigravity", action: "refresh-token", method: "POST", path: "/admin/antigravity/oauth/refresh-token", rawBody: true, description: "刷新 Antigravity Token" },
];
