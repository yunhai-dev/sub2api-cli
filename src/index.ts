#!/usr/bin/env node

import { Command } from "commander";
import type { GlobalOptions } from "./types.js";
import { registerDomain } from "./commands/index.js";
import { getEndpointsByDomain } from "./endpoints/index.js";
import { apiRequest, ApiError } from "./client.js";
import { printResult, printError } from "./output.js";

const program = new Command();

// 全局选项
const globalOpts: GlobalOptions = {};

program
  .name("s2a")
  .description("sub2api Admin CLI - 管理 sub2api 的命令行工具")
  .version("1.0.0")
  .option("--url <url>", "API Base URL (或设置 SUB2API_BASE_URL 环境变量)")
  .option("--key <key>", "Admin API Key (或设置 SUB2API_ADMIN_KEY 环境变量)")
  .option("--output <format>", "输出格式: json/table", "json")
  .option("--data-only", "仅输出 data 字段（去掉 code/message 包装）", false)
  .option("--quiet", "静默模式（仅错误时输出）", false)
  .option("--compact", "紧凑结构输出（同结构数组→cols/rows，节省 Agent token）", false)
  .hook("preAction", (thisCommand) => {
    // 合并全局选项
    const opts = thisCommand.opts();
    globalOpts.url = opts.url;
    globalOpts.key = opts.key;
    globalOpts.output = opts.output;
    globalOpts.dataOnly = opts.dataOnly;
    globalOpts.quiet = opts.quiet;
    globalOpts.compact = opts.compact;
  });

// 注册所有域的子命令
const endpointsByDomain = getEndpointsByDomain();
for (const [domain, endpoints] of endpointsByDomain) {
  registerDomain(program, domain, endpoints, globalOpts);
}

// 注册 raw 命令（兜底任意请求）
program
  .command("raw")
  .argument("<method>", "HTTP 方法 (GET/POST/PUT/DELETE/PATCH)")
  .argument("<path>", "请求路径 (如 /admin/custom/endpoint)")
  .option("--json <data>", "请求体 JSON")
  .option("--query <params>", "查询参数 (key=value&key2=value2)")
  .description("发送原始 API 请求")
  .action(async (method: string, path: string, opts: { json?: string; query?: string }) => {
    try {
      let body: Record<string, unknown> | null = null;

      if (opts.json) {
        if (opts.json === "-") {
          const chunks: Buffer[] = [];
          for await (const chunk of process.stdin) {
            chunks.push(chunk);
          }
          body = JSON.parse(Buffer.concat(chunks).toString("utf-8")) as Record<string, unknown>;
        } else if (opts.json.startsWith("@")) {
          const fs = await import("fs/promises");
          body = JSON.parse(await fs.readFile(opts.json.slice(1), "utf-8")) as Record<string, unknown>;
        } else {
          body = JSON.parse(opts.json) as Record<string, unknown>;
        }
      }

      // 解析查询参数
      const queryParams: Record<string, string> = {};
      if (opts.query) {
        for (const pair of opts.query.split("&")) {
          const [key, value] = pair.split("=", 2);
          if (key) queryParams[decodeURIComponent(key)] = decodeURIComponent(value || "");
        }
      }

      const response = await apiRequest({
        method: method.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        path,
        queryParams,
        body,
        globalOpts,
      });

      printResult(response, globalOpts);
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

// 添加 domains 命令，列出所有可用域
program
  .command("domains")
  .description("列出所有可用的命令域")
  .action(() => {
    console.log("可用的命令域:\n");
    for (const [domain, endpoints] of endpointsByDomain) {
      console.log(`  ${domain.padEnd(28)} (${endpoints.length} 个命令)`);
    }
    console.log(`\n共 ${endpointsByDomain.size} 个域，${[...endpointsByDomain.values()].flat().length} 个命令`);
    console.log("\n使用 s2a <domain> --help 查看域下所有命令");
    console.log("使用 s2a raw <method> <path> 发送原始请求");
  });

// 解析并执行
program.parseAsync(process.argv).catch((err) => {
  printError(err);
  process.exit(1);
});
