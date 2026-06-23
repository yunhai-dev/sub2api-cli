import type { GlobalOptions, ApiResponse } from "./types.js";

export function printResult<T>(
  response: ApiResponse<T>,
  opts: GlobalOptions
): void {
  if (opts.quiet) return;

  const output = opts.dataOnly ? response.data : response;
  const format = opts.output || "json";

  if (format === "table") {
    printTable(output);
  } else if (opts.compact) {
    // Agent-friendly: structural compression to save tokens (all data preserved)
    console.log(JSON.stringify(compactOutput(output)));
  } else {
    console.log(JSON.stringify(output, null, 2));
  }
}

// 递归压缩输出结构（保留全部数据）
// - 同结构对象数组 → {cols, rows} 格式（消除重复 key）
// - 递归处理嵌套结构
function compactOutput(value: unknown): unknown {
  if (Array.isArray(value)) {
    const arr = value.map(compactOutput);

    // 同结构对象数组（≥2 项）→ {cols, rows}
    if (arr.length >= 2 && isUniformObjectArray(arr)) {
      const cols = Object.keys(arr[0] as Record<string, unknown>);
      const rows = arr.map((item) =>
        cols.map((k) => (item as Record<string, unknown>)[k])
      );
      return { cols, rows };
    }

    return arr;
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = compactOutput(v);
    }
    return result;
  }

  return value;
}

// 判断数组中所有对象是否拥有相同的 key 集合
function isUniformObjectArray(arr: unknown[]): boolean {
  if (arr.length < 2) return false;
  const first = arr[0] as Record<string, unknown>;
  if (typeof first !== "object" || first === null || Array.isArray(first)) return false;
  const keys = Object.keys(first).sort().join(",");
  for (let i = 1; i < arr.length; i++) {
    const item = arr[i] as Record<string, unknown>;
    if (typeof item !== "object" || item === null || Array.isArray(item)) return false;
    if (Object.keys(item).sort().join(",") !== keys) return false;
  }
  return true;
}

function printTable(data: unknown): void {
  if (!data) {
    console.log("(无数据)");
    return;
  }

  // 如果是分页数据
  if (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray((data as { items: unknown[] }).items)
  ) {
    const { items, total, page, pages } = data as {
      items: Record<string, unknown>[];
      total: number;
      page: number;
      pages: number;
    };
    if (items.length === 0) {
      console.log("(无记录)");
      return;
    }
    printArrayAsTable(items);
    console.log(`\n共 ${total} 条记录，当前第 ${page}/${pages} 页`);
    return;
  }

  // 如果是数组
  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log("(无记录)");
      return;
    }
    printArrayAsTable(data as Record<string, unknown>[]);
    return;
  }

  // 如果是对象，key-value 展示
  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    const maxKeyLen = Math.max(...entries.map(([k]) => k.length), 10);
    for (const [key, value] of entries) {
      const display =
        typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
      console.log(`${key.padEnd(maxKeyLen)}  ${display}`);
    }
    return;
  }

  console.log(String(data));
}

function printArrayAsTable(items: Record<string, unknown>[]): void {
  if (items.length === 0) return;

  // 选取主要列（最多8列，避免终端溢出）
  const allKeys = Object.keys(items[0]);
  const keys = allKeys.slice(0, 8);

  // 计算列宽
  const widths: Record<string, number> = {};
  for (const key of keys) {
    widths[key] = key.length;
    for (const item of items) {
      const val = String(item[key] ?? "");
      widths[key] = Math.max(widths[key], Math.min(val.length, 40));
    }
  }

  // 打印表头
  const header = keys.map((k) => k.padEnd(widths[k])).join("  ");
  console.log(header);
  console.log(keys.map((k) => "-".repeat(widths[k])).join("  "));

  // 打印行
  for (const item of items) {
    const row = keys
      .map((k) => {
        const val = String(item[k] ?? "");
        return val.length > 40 ? val.slice(0, 37) + "..." : val.padEnd(widths[k]);
      })
      .join("  ");
    console.log(row);
  }
}

export function printError(err: unknown): void {
  if (err instanceof Error) {
    console.error(`错误: ${err.message}`);
  } else {
    console.error(`错误: ${String(err)}`);
  }
}
