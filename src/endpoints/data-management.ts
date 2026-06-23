import type { EndpointDef } from "../types.js";

export const dataManagementEndpoints: EndpointDef[] = [
  { domain: "data-management", action: "agent-health", method: "GET", path: "/admin/data-management/agent/health", description: "获取数据管理代理健康状态" },
  { domain: "data-management", action: "config", method: "GET", path: "/admin/data-management/config", description: "获取数据管理配置" },
  { domain: "data-management", action: "update-config", method: "PUT", path: "/admin/data-management/config", rawBody: true, description: "更新数据管理配置" },
  { domain: "data-management", action: "list-source-profiles", method: "GET", path: "/admin/data-management/sources/:source_type/profiles", pathParams: [{ name: "source_type", type: "string", required: true, description: "源类型" }], description: "列出数据源配置" },
  { domain: "data-management", action: "create-source-profile", method: "POST", path: "/admin/data-management/sources/:source_type/profiles", pathParams: [{ name: "source_type", type: "string", required: true, description: "源类型" }], rawBody: true, description: "创建数据源配置" },
  { domain: "data-management", action: "update-source-profile", method: "PUT", path: "/admin/data-management/sources/:source_type/profiles/:profile_id", pathParams: [{ name: "source_type", type: "string", required: true, description: "源类型" }, { name: "profile_id", type: "string", required: true, description: "配置 ID" }], rawBody: true, description: "更新数据源配置" },
  { domain: "data-management", action: "delete-source-profile", method: "DELETE", path: "/admin/data-management/sources/:source_type/profiles/:profile_id", pathParams: [{ name: "source_type", type: "string", required: true, description: "源类型" }, { name: "profile_id", type: "string", required: true, description: "配置 ID" }], description: "删除数据源配置" },
  { domain: "data-management", action: "activate-source-profile", method: "POST", path: "/admin/data-management/sources/:source_type/profiles/:profile_id/activate", pathParams: [{ name: "source_type", type: "string", required: true, description: "源类型" }, { name: "profile_id", type: "string", required: true, description: "配置 ID" }], description: "激活数据源配置" },
  { domain: "data-management", action: "test-s3", method: "POST", path: "/admin/data-management/s3/test", rawBody: true, description: "测试 S3 连接" },
  { domain: "data-management", action: "list-s3-profiles", method: "GET", path: "/admin/data-management/s3/profiles", description: "列出 S3 配置" },
  { domain: "data-management", action: "create-s3-profile", method: "POST", path: "/admin/data-management/s3/profiles", rawBody: true, description: "创建 S3 配置" },
  { domain: "data-management", action: "update-s3-profile", method: "PUT", path: "/admin/data-management/s3/profiles/:profile_id", pathParams: [{ name: "profile_id", type: "string", required: true, description: "配置 ID" }], rawBody: true, description: "更新 S3 配置" },
  { domain: "data-management", action: "delete-s3-profile", method: "DELETE", path: "/admin/data-management/s3/profiles/:profile_id", pathParams: [{ name: "profile_id", type: "string", required: true, description: "配置 ID" }], description: "删除 S3 配置" },
  { domain: "data-management", action: "activate-s3-profile", method: "POST", path: "/admin/data-management/s3/profiles/:profile_id/activate", pathParams: [{ name: "profile_id", type: "string", required: true, description: "配置 ID" }], description: "激活 S3 配置" },
  { domain: "data-management", action: "create-backup-job", method: "POST", path: "/admin/data-management/backups", rawBody: true, description: "创建备份任务" },
  { domain: "data-management", action: "list-backup-jobs", method: "GET", path: "/admin/data-management/backups", description: "列出备份任务" },
  { domain: "data-management", action: "get-backup-job", method: "GET", path: "/admin/data-management/backups/:job_id", pathParams: [{ name: "job_id", type: "string", required: true, description: "任务 ID" }], description: "获取备份任务详情" },
];

export const backupEndpoints: EndpointDef[] = [
  { domain: "backup", action: "s3-config", method: "GET", path: "/admin/backups/s3-config", description: "获取备份 S3 配置" },
  { domain: "backup", action: "update-s3-config", method: "PUT", path: "/admin/backups/s3-config", rawBody: true, description: "更新备份 S3 配置" },
  { domain: "backup", action: "test-s3", method: "POST", path: "/admin/backups/s3-config/test", description: "测试备份 S3 连接" },
  { domain: "backup", action: "schedule", method: "GET", path: "/admin/backups/schedule", description: "获取备份计划" },
  { domain: "backup", action: "update-schedule", method: "PUT", path: "/admin/backups/schedule", rawBody: true, description: "更新备份计划" },
  { domain: "backup", action: "create", method: "POST", path: "/admin/backups", description: "创建备份" },
  { domain: "backup", action: "list", method: "GET", path: "/admin/backups", queryParams: [{ name: "page", type: "number", required: false, description: "页码" }, { name: "page_size", type: "number", required: false, description: "每页数量" }], isPaginated: true, description: "列出备份", aliases: ["ls"] },
  { domain: "backup", action: "get", method: "GET", path: "/admin/backups/:id", pathParams: [{ name: "id", type: "number", required: true, description: "备份 ID" }], description: "获取备份详情" },
  { domain: "backup", action: "delete", method: "DELETE", path: "/admin/backups/:id", pathParams: [{ name: "id", type: "number", required: true, description: "备份 ID" }], description: "删除备份" },
  { domain: "backup", action: "download-url", method: "GET", path: "/admin/backups/:id/download-url", pathParams: [{ name: "id", type: "number", required: true, description: "备份 ID" }], description: "获取备份下载链接" },
  { domain: "backup", action: "restore", method: "POST", path: "/admin/backups/:id/restore", pathParams: [{ name: "id", type: "number", required: true, description: "备份 ID" }], description: "恢复备份" },
];
