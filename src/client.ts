import type { ApiResponse, GlobalOptions, HttpMethod } from "./types.js";
import { getBaseUrl, getAdminKey } from "./config.js";

interface RequestOptions {
  method: HttpMethod;
  path: string;
  queryParams?: Record<string, string | number | boolean | undefined>;
  body?: Record<string, unknown> | null;
  globalOpts: GlobalOptions;
}

export async function apiRequest<T = unknown>(
  opts: RequestOptions
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl(opts.globalOpts);
  const adminKey = getAdminKey(opts.globalOpts);

  // 构建 URL
  let url = `${baseUrl}/api/v1${opts.path}`;

  // 处理查询参数
  if (opts.queryParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(opts.queryParams)) {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  // 构建请求头
  const headers: Record<string, string> = {
    "x-api-key": adminKey,
    "Content-Type": "application/json",
  };

  // 构建请求选项
  const fetchOpts: RequestInit = {
    method: opts.method,
    headers,
  };
  if (opts.body && ["POST", "PUT", "PATCH"].includes(opts.method)) {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  try {
    const response = await fetch(url, fetchOpts);

    // 尝试解析 JSON
    let data: ApiResponse<T>;
    try {
      data = (await response.json()) as ApiResponse<T>;
    } catch {
      throw new Error(
        `HTTP ${response.status}: 无法解析响应 JSON`
      );
    }

    // 检查业务层错误
    if (data.code !== 0) {
      throw new ApiError(
        data.message || "Unknown error",
        data.code,
        data.reason
      );
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof TypeError && err.message.includes("fetch")) {
      throw new Error(
        `网络连接失败: ${baseUrl}\n请检查 SUB2API_BASE_URL 是否正确，以及服务是否可达。`
      );
    }
    throw err;
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public reason?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 分页请求：自动拉取所有页
export async function apiRequestPaginated<T = unknown>(
  opts: Omit<RequestOptions, "queryParams"> & {
    queryParams?: Record<string, string | number | boolean | undefined>;
  }
): Promise<{ items: T[]; total: number }> {
  const firstPage = await apiRequest<{
    items: T[];
    total: number;
    page: number;
    pages: number;
  }>(opts);

  const data = firstPage.data!;
  const allItems = [...data.items];

  // 如果有更多页，继续拉取
  for (let page = 2; page <= data.pages; page++) {
    const next = await apiRequest<{ items: T[] }>({
      ...opts,
      queryParams: { ...opts.queryParams, page },
    });
    allItems.push(...next.data!.items);
  }

  return { items: allItems, total: data.total };
}
