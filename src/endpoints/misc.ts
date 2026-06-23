import type { EndpointDef } from "../types.js";

export const userAttributeEndpoints: EndpointDef[] = [
  {
    domain: "user-attributes",
    action: "list",
    method: "GET",
    path: "/admin/user-attributes",
    description: "列出用户属性定义",
    aliases: ["ls"],
  },
  {
    domain: "user-attributes",
    action: "create",
    method: "POST",
    path: "/admin/user-attributes",
    rawBody: true,
    description: "创建用户属性定义 (使用 --json 传入)",
  },
  {
    domain: "user-attributes",
    action: "batch",
    method: "POST",
    path: "/admin/user-attributes/batch",
    rawBody: true,
    description: "批量获取用户属性",
  },
  {
    domain: "user-attributes",
    action: "reorder",
    method: "PUT",
    path: "/admin/user-attributes/reorder",
    rawBody: true,
    description: "重新排序用户属性",
  },
  {
    domain: "user-attributes",
    action: "update",
    method: "PUT",
    path: "/admin/user-attributes/:id",
    pathParams: [{ name: "id", type: "number", required: true, description: "属性 ID" }],
    rawBody: true,
    description: "更新用户属性定义 (使用 --json 传入)",
  },
  {
    domain: "user-attributes",
    action: "delete",
    method: "DELETE",
    path: "/admin/user-attributes/:id",
    pathParams: [{ name: "id", type: "number", required: true, description: "属性 ID" }],
    description: "删除用户属性定义",
  },
];

export const apiKeyEndpoints: EndpointDef[] = [
  {
    domain: "api-keys",
    action: "update-group",
    method: "PUT",
    path: "/admin/api-keys/:id",
    pathParams: [{ name: "id", type: "number", required: true, description: "API Key ID" }],
    rawBody: true,
    description: "更新 API Key 分组",
  },
];

export const complianceEndpoints: EndpointDef[] = [
  {
    domain: "compliance",
    action: "status",
    method: "GET",
    path: "/admin/compliance",
    description: "获取合规状态",
  },
  {
    domain: "compliance",
    action: "accept",
    method: "POST",
    path: "/admin/compliance/accept",
    description: "接受合规条款",
  },
];
