import type { EndpointDef } from "../types.js";

export const systemEndpoints: EndpointDef[] = [
  {
    domain: "system",
    action: "version",
    method: "GET",
    path: "/admin/system/version",
    description: "获取系统版本",
  },
  {
    domain: "system",
    action: "check-updates",
    method: "GET",
    path: "/admin/system/check-updates",
    description: "检查系统更新",
  },
  {
    domain: "system",
    action: "update",
    method: "POST",
    path: "/admin/system/update",
    rawBody: true,
    description: "执行系统更新",
  },
  {
    domain: "system",
    action: "rollback",
    method: "POST",
    path: "/admin/system/rollback",
    rawBody: true,
    description: "回滚系统",
  },
  {
    domain: "system",
    action: "restart",
    method: "POST",
    path: "/admin/system/restart",
    description: "重启服务",
  },
];
