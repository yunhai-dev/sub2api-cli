import type { EndpointDef } from "../types.js";

export const usageEndpoints: EndpointDef[] = [
  {
    domain: "usage",
    action: "list",
    method: "GET",
    path: "/admin/usage",
    queryParams: [
      { name: "page", type: "number", required: false, description: "页码" },
      { name: "page_size", type: "number", required: false, description: "每页数量" },
      { name: "sort_by", type: "string", required: false, description: "排序字段" },
      { name: "sort_order", type: "string", required: false, description: "asc/desc" },
    ],
    isPaginated: true,
    description: "列出用量记录",
    aliases: ["ls"],
  },
  {
    domain: "usage",
    action: "stats",
    method: "GET",
    path: "/admin/usage/stats",
    description: "获取用量统计",
  },
  {
    domain: "usage",
    action: "search-users",
    method: "GET",
    path: "/admin/usage/search-users",
    queryParams: [
      { name: "search", type: "string", required: false, description: "搜索关键词" },
    ],
    description: "搜索用户",
  },
  {
    domain: "usage",
    action: "search-api-keys",
    method: "GET",
    path: "/admin/usage/search-api-keys",
    queryParams: [
      { name: "search", type: "string", required: false, description: "搜索关键词" },
    ],
    description: "搜索 API Keys",
  },
  {
    domain: "usage",
    action: "cleanup-tasks",
    method: "GET",
    path: "/admin/usage/cleanup-tasks",
    description: "列出清理任务",
  },
  {
    domain: "usage",
    action: "create-cleanup-task",
    method: "POST",
    path: "/admin/usage/cleanup-tasks",
    rawBody: true,
    description: "创建清理任务",
  },
  {
    domain: "usage",
    action: "cancel-cleanup-task",
    method: "POST",
    path: "/admin/usage/cleanup-tasks/:id/cancel",
    pathParams: [{ name: "id", type: "number", required: true, description: "任务 ID" }],
    description: "取消清理任务",
  },
];
