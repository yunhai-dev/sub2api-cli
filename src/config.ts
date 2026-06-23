import type { GlobalOptions } from "./types.js";

const ENV_BASE_URL = "SUB2API_BASE_URL";
const ENV_ADMIN_KEY = "SUB2API_ADMIN_KEY";

export function getBaseUrl(opts: GlobalOptions): string {
  const url = opts.url || process.env[ENV_BASE_URL];
  if (!url) {
    console.error(
      `错误: 未设置 Base URL。请通过以下方式之一设置:\n` +
        `  1. 环境变量: export ${ENV_BASE_URL}="https://your-instance.com"\n` +
        `  2. 命令行参数: s2a --url https://your-instance.com ...`
    );
    process.exit(1);
  }
  return url.replace(/\/+$/, "");
}

export function getAdminKey(opts: GlobalOptions): string {
  const key = opts.key || process.env[ENV_ADMIN_KEY];
  if (!key) {
    console.error(
      `错误: 未设置 Admin Key。请通过以下方式之一设置:\n` +
        `  1. 环境变量: export ${ENV_ADMIN_KEY}="admin-your-key"\n` +
        `  2. 命令行参数: s2a --key admin-your-key ...`
    );
    process.exit(1);
  }
  return key;
}
