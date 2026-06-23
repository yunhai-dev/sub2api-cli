import type { EndpointDef } from "../types.js";

export const opsEndpoints: EndpointDef[] = [
  // Realtime
  { domain: "ops", action: "concurrency", method: "GET", path: "/admin/ops/concurrency", description: "获取并发统计" },
  { domain: "ops", action: "user-concurrency", method: "GET", path: "/admin/ops/user-concurrency", description: "获取用户并发统计" },
  { domain: "ops", action: "account-availability", method: "GET", path: "/admin/ops/account-availability", description: "获取账号可用性" },
  { domain: "ops", action: "realtime-traffic", method: "GET", path: "/admin/ops/realtime-traffic", description: "获取实时流量摘要" },

  // Alert Rules
  { domain: "ops", action: "alert-rules", method: "GET", path: "/admin/ops/alert-rules", description: "列出告警规则", aliases: ["alerts"] },
  { domain: "ops", action: "create-alert-rule", method: "POST", path: "/admin/ops/alert-rules", rawBody: true, description: "创建告警规则" },
  { domain: "ops", action: "update-alert-rule", method: "PUT", path: "/admin/ops/alert-rules/:id", pathParams: [{ name: "id", type: "number", required: true, description: "规则 ID" }], rawBody: true, description: "更新告警规则" },
  { domain: "ops", action: "delete-alert-rule", method: "DELETE", path: "/admin/ops/alert-rules/:id", pathParams: [{ name: "id", type: "number", required: true, description: "规则 ID" }], description: "删除告警规则" },

  // Alert Events
  { domain: "ops", action: "alert-events", method: "GET", path: "/admin/ops/alert-events", queryParams: [
    { name: "page", type: "number", required: false, description: "页码" },
    { name: "page_size", type: "number", required: false, description: "每页数量" },
  ], isPaginated: true, description: "列出告警事件" },
  { domain: "ops", action: "get-alert-event", method: "GET", path: "/admin/ops/alert-events/:id", pathParams: [{ name: "id", type: "number", required: true, description: "事件 ID" }], description: "获取告警事件详情" },
  { domain: "ops", action: "update-alert-event-status", method: "PUT", path: "/admin/ops/alert-events/:id/status", pathParams: [{ name: "id", type: "number", required: true, description: "事件 ID" }], rawBody: true, description: "更新告警事件状态" },
  { domain: "ops", action: "create-alert-silence", method: "POST", path: "/admin/ops/alert-silences", rawBody: true, description: "创建告警静默规则" },

  // Email Notification
  { domain: "ops", action: "email-notification-config", method: "GET", path: "/admin/ops/email-notification/config", description: "获取邮件通知配置" },
  { domain: "ops", action: "update-email-notification-config", method: "PUT", path: "/admin/ops/email-notification/config", rawBody: true, description: "更新邮件通知配置" },

  // Runtime Settings
  { domain: "ops", action: "alert-runtime", method: "GET", path: "/admin/ops/runtime/alert", description: "获取告警运行时设置" },
  { domain: "ops", action: "update-alert-runtime", method: "PUT", path: "/admin/ops/runtime/alert", rawBody: true, description: "更新告警运行时设置" },
  { domain: "ops", action: "logging-config", method: "GET", path: "/admin/ops/runtime/logging", description: "获取日志配置" },
  { domain: "ops", action: "update-logging-config", method: "PUT", path: "/admin/ops/runtime/logging", rawBody: true, description: "更新日志配置" },
  { domain: "ops", action: "reset-logging", method: "POST", path: "/admin/ops/runtime/logging/reset", description: "重置日志配置" },

  // Advanced & Thresholds
  { domain: "ops", action: "advanced-settings", method: "GET", path: "/admin/ops/advanced-settings", description: "获取高级设置" },
  { domain: "ops", action: "update-advanced-settings", method: "PUT", path: "/admin/ops/advanced-settings", rawBody: true, description: "更新高级设置" },
  { domain: "ops", action: "metric-thresholds", method: "GET", path: "/admin/ops/settings/metric-thresholds", description: "获取指标阈值" },
  { domain: "ops", action: "update-metric-thresholds", method: "PUT", path: "/admin/ops/settings/metric-thresholds", rawBody: true, description: "更新指标阈值" },

  // Error Logs (Legacy)
  { domain: "ops", action: "errors", method: "GET", path: "/admin/ops/errors", queryParams: [
    { name: "page", type: "number", required: false, description: "页码" },
    { name: "page_size", type: "number", required: false, description: "每页数量" },
  ], isPaginated: true, description: "列出错误日志" },
  { domain: "ops", action: "get-error", method: "GET", path: "/admin/ops/errors/:id", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], description: "获取错误详情" },
  { domain: "ops", action: "resolve-error", method: "PUT", path: "/admin/ops/errors/:id/resolve", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], rawBody: true, description: "标记错误已解决" },

  // Request Errors
  { domain: "ops", action: "request-errors", method: "GET", path: "/admin/ops/request-errors", queryParams: [
    { name: "page", type: "number", required: false, description: "页码" },
    { name: "page_size", type: "number", required: false, description: "每页数量" },
  ], isPaginated: true, description: "列出请求错误" },
  { domain: "ops", action: "get-request-error", method: "GET", path: "/admin/ops/request-errors/:id", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], description: "获取请求错误详情" },
  { domain: "ops", action: "request-error-upstream", method: "GET", path: "/admin/ops/request-errors/:id/upstream-errors", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], description: "列出请求错误的上游错误" },
  { domain: "ops", action: "resolve-request-error", method: "PUT", path: "/admin/ops/request-errors/:id/resolve", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], rawBody: true, description: "标记请求错误已解决" },

  // Upstream Errors
  { domain: "ops", action: "upstream-errors", method: "GET", path: "/admin/ops/upstream-errors", queryParams: [
    { name: "page", type: "number", required: false, description: "页码" },
    { name: "page_size", type: "number", required: false, description: "每页数量" },
  ], isPaginated: true, description: "列出上游错误" },
  { domain: "ops", action: "get-upstream-error", method: "GET", path: "/admin/ops/upstream-errors/:id", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], description: "获取上游错误详情" },
  { domain: "ops", action: "resolve-upstream-error", method: "PUT", path: "/admin/ops/upstream-errors/:id/resolve", pathParams: [{ name: "id", type: "number", required: true, description: "错误 ID" }], rawBody: true, description: "标记上游错误已解决" },

  // Request Drilldown
  { domain: "ops", action: "requests", method: "GET", path: "/admin/ops/requests", queryParams: [
    { name: "page", type: "number", required: false, description: "页码" },
    { name: "page_size", type: "number", required: false, description: "每页数量" },
  ], isPaginated: true, description: "查看请求详情" },

  // System Logs
  { domain: "ops", action: "system-logs", method: "GET", path: "/admin/ops/system-logs", queryParams: [
    { name: "page", type: "number", required: false, description: "页码" },
    { name: "page_size", type: "number", required: false, description: "每页数量" },
  ], isPaginated: true, description: "列出系统日志" },
  { domain: "ops", action: "cleanup-system-logs", method: "POST", path: "/admin/ops/system-logs/cleanup", rawBody: true, description: "清理系统日志" },
  { domain: "ops", action: "system-log-health", method: "GET", path: "/admin/ops/system-logs/health", description: "获取系统日志写入健康状态" },

  // Ops Dashboard
  { domain: "ops", action: "dashboard-snapshot", method: "GET", path: "/admin/ops/dashboard/snapshot-v2", description: "获取运维仪表盘快照" },
  { domain: "ops", action: "dashboard-overview", method: "GET", path: "/admin/ops/dashboard/overview", description: "获取运维概览" },
  { domain: "ops", action: "throughput-trend", method: "GET", path: "/admin/ops/dashboard/throughput-trend", description: "获取吞吐趋势" },
  { domain: "ops", action: "latency-histogram", method: "GET", path: "/admin/ops/dashboard/latency-histogram", description: "获取延迟分布" },
  { domain: "ops", action: "error-trend", method: "GET", path: "/admin/ops/dashboard/error-trend", description: "获取错误趋势" },
  { domain: "ops", action: "error-distribution", method: "GET", path: "/admin/ops/dashboard/error-distribution", description: "获取错误分布" },
  { domain: "ops", action: "openai-token-stats", method: "GET", path: "/admin/ops/dashboard/openai-token-stats", description: "获取 OpenAI Token 统计" },
];
