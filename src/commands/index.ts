import { Command } from "commander";
import type { EndpointDef, GlobalOptions, ParamDef } from "../types.js";
import { apiRequest, apiRequestPaginated, ApiError } from "../client.js";
import { printResult, printError } from "../output.js";

// 将 path 中的 :param 替换为实际值
function buildPath(template: string, params: Record<string, string>): string {
  let path = template;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  }
  return path;
}

// 为单个 endpoint 注册子命令
function registerEndpoint(
  parentCmd: Command,
  endpoint: EndpointDef,
  globalOptsRef: GlobalOptions
): void {
  // 构建命令签名
  let signature = endpoint.action;
  if (endpoint.pathParams) {
    for (const p of endpoint.pathParams) {
      signature += ` <${p.name}>`;
    }
  }

  const cmd = parentCmd
    .command(signature)
    .description(endpoint.description);

  // 注册别名
  if (endpoint.aliases) {
    for (const alias of endpoint.aliases) {
      cmd.alias(alias);
    }
  }

  // 注册查询参数（当 isPaginated 时跳过 page/page_size，由分页逻辑统一注册）
  const paginatedSkip = endpoint.isPaginated ? new Set(["page", "page_size"]) : new Set<string>();
  if (endpoint.queryParams) {
    for (const param of endpoint.queryParams) {
      if (paginatedSkip.has(param.name)) continue;
      const flag = param.flag || `--${param.name.replace(/_/g, "-")}`;
      const flagSpec = param.type === "boolean" ? flag : `${flag} <value>`;
      cmd.option(
        flagSpec,
        `${param.description}${param.required ? " (必填)" : ""}`
      );
    }
  }

  // 注册请求体参数
  if (endpoint.bodyParams) {
    for (const param of endpoint.bodyParams) {
      const flag = param.flag || `--${param.name.replace(/_/g, "-")}`;
      const flagSpec = param.type === "boolean" ? flag : `${flag} <value>`;
      cmd.option(
        flagSpec,
        `${param.description}${param.required ? " (必填)" : ""}`
      );
    }
  }

  // 支持 --json 直接传入完整 body
  if (endpoint.rawBody || (endpoint.bodyParams && endpoint.bodyParams.length > 0)) {
    cmd.option("--json <data>", "直接传入 JSON 格式的请求体 (支持文件路径或 stdin 用 -)");
  }

  // 分页相关
  if (endpoint.isPaginated) {
    cmd.option("--page <n>", "页码", "1");
    cmd.option("--page-size <n>", "每页数量", "20");
    cmd.option("--all", "拉取所有分页数据");
  }

  // 分页快捷参数
  if (endpoint.queryParams?.some((p) => p.name === "page")) {
    // 已在 isPaginated 中处理
  }

  // 执行逻辑
  cmd.action(async (...args: unknown[]) => {
    try {
      // commander 传入的参数：positional args 最后一个是 Command 对象
      const commandObj = args[args.length - 1] as Command;
      const opts = commandObj.opts();

      // 合并全局参数
      const globalOpts: GlobalOptions = {
        ...globalOptsRef,
        output: opts.output || globalOptsRef.output,
        dataOnly: opts.dataOnly ?? globalOptsRef.dataOnly,
        quiet: opts.quiet ?? globalOptsRef.quiet,
      };

      // 提取路径参数
      const pathParamValues: Record<string, string> = {};
      if (endpoint.pathParams) {
        const positionalArgs = args.slice(0, -1) as string[];
        for (let i = 0; i < endpoint.pathParams.length; i++) {
          pathParamValues[endpoint.pathParams[i].name] = positionalArgs[i];
        }
      }

      // 构建查询参数
      const queryParams: Record<string, string | number | boolean | undefined> = {};
      if (endpoint.queryParams) {
        for (const param of endpoint.queryParams) {
          const flagName = param.flag
            ? param.flag.replace(/^--/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase())
            : param.name.replace(/_/g, "-");
          const camelName = flagName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          // 直接用 param.name 作为 opts key（commander 使用 camelCase 转换）
          const value = opts[param.name] ?? opts[camelName] ?? opts[flagName];
          if (value !== undefined) {
            queryParams[param.name] = value;
          }
        }
      }

      // 处理 --all 分页
      const allPages = endpoint.isPaginated && opts.all;

      // 构建请求体
      let body: Record<string, unknown> | null = null;
      if (["POST", "PUT", "PATCH"].includes(endpoint.method)) {
        if (opts.json) {
          // 从 --json 参数解析
          body = await parseJsonInput(opts.json);
        } else if (endpoint.bodyParams) {
          body = {};
          for (const param of endpoint.bodyParams) {
            const camelName = param.name.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
            const value = opts[param.name] ?? opts[camelName];
            if (value !== undefined) {
              body[param.name] = parseValue(value as string, param.type);
            } else if (param.required) {
              console.error(`错误: 缺少必填参数 --${param.name.replace(/_/g, "-")}`);
              process.exit(1);
            }
          }
          if (Object.keys(body).length === 0) body = null;
        }
      }

      // 发起请求
      const path = buildPath(endpoint.path, pathParamValues);

      if (allPages) {
        const result = await apiRequestPaginated({
          method: endpoint.method,
          path,
          queryParams,
          body,
          globalOpts,
        });
        printResult({ code: 0, message: "success", data: result }, globalOpts);
      } else {
        const response = await apiRequest({
          method: endpoint.method,
          path,
          queryParams,
          body,
          globalOpts,
        });
        printResult(response, globalOpts);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(`API 错误 [${err.code}]: ${err.message}`);
        if (err.reason) console.error(`原因: ${err.reason}`);
        process.exit(1);
      }
      printError(err);
      process.exit(1);
    }
  });
}

// 解析 JSON 输入（支持文件路径、- 表示 stdin、直接 JSON 字符串）
async function parseJsonInput(input: string): Promise<Record<string, unknown>> {
  let raw: string;

  if (input === "-") {
    // 从 stdin 读取
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    raw = Buffer.concat(chunks).toString("utf-8");
  } else if (input.startsWith("@")) {
    // 从文件读取
    const fs = await import("fs/promises");
    raw = await fs.readFile(input.slice(1), "utf-8");
  } else {
    raw = input;
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.error("错误: 无法解析 JSON 输入");
    process.exit(1);
  }
}

// 解析命令行值
function parseValue(
  value: string,
  type: "string" | "number" | "boolean" | "json"
): unknown {
  switch (type) {
    case "number":
      return Number(value);
    case "boolean":
      return value === "true" || value === "1";
    case "json":
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
}

// 注册一个域的所有 endpoint
export function registerDomain(
  program: Command,
  domain: string,
  endpoints: EndpointDef[],
  globalOptsRef: GlobalOptions
): void {
  const domainCmd = program.command(domain).description(getDomainDescription(domain));

  for (const endpoint of endpoints) {
    registerEndpoint(domainCmd, endpoint, globalOptsRef);
  }
}

// 获取域的描述
function getDomainDescription(domain: string): string {
  const descriptions: Record<string, string> = {
    users: "用户管理",
    groups: "分组管理",
    accounts: "账号管理",
    subscriptions: "订阅管理",
    settings: "系统设置",
    dashboard: "仪表盘",
    ops: "运维监控",
    usage: "用量记录",
    system: "系统管理",
    proxies: "代理管理",
    announcements: "公告管理",
    "redeem-codes": "兑换码管理",
    "promo-codes": "优惠码管理",
    channels: "渠道管理",
    "channel-monitors": "渠道监控",
    "channel-monitor-templates": "渠道监控模板",
    "data-management": "数据管理",
    backup: "备份管理",
    "user-attributes": "用户属性",
    "api-keys": "API Key 管理",
    compliance: "合规管理",
    "error-passthrough-rules": "错误透传规则",
    "tls-fingerprint-profiles": "TLS 指纹配置",
    "scheduled-test-plans": "定时测试计划",
    "risk-control": "内容风控",
    affiliates: "邀请返利",
    openai: "OpenAI OAuth",
    gemini: "Gemini OAuth",
    antigravity: "Antigravity OAuth",
  };
  return descriptions[domain] || domain;
}
