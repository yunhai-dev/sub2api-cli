export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ParamType = "string" | "number" | "boolean" | "json";

export interface ParamDef {
  name: string;
  type: ParamType;
  required: boolean;
  description: string;
  flag?: string; // CLI flag 名，默认同 name
}

export interface EndpointDef {
  domain: string;
  action: string;
  method: HttpMethod;
  path: string;
  pathParams?: ParamDef[];
  queryParams?: ParamDef[];
  bodyParams?: ParamDef[];
  isPaginated?: boolean;
  rawBody?: boolean; // 接受 --json 作为完整 body
  description: string;
  aliases?: string[];
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
  reason?: string;
}

export interface PaginatedData<T = unknown> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface GlobalOptions {
  url?: string;
  key?: string;
  output?: "json" | "table";
  dataOnly?: boolean;
  quiet?: boolean;
}
