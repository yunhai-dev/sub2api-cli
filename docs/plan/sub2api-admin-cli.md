# Sub2API Admin CLI 设计文档

## Background & Goals

sub2api 拥有约 313 个 admin API endpoints，横跨 29 个资源域。目标是构建一个 CLI 工具，完整覆盖所有 admin 接口，同时：
- 支持通过环境变量配置 `SUB2API_BASE_URL` 和 `SUB2API_ADMIN_KEY`
- 命令结构清晰、符合 CLI 直觉
- 新增接口时只需添加一行声明，无需写新代码

**成功标准：**
- 所有 admin endpoints 可通过 CLI 调用
- 环境变量 + 命令行参数两种配置方式
- 输出支持 JSON / 表格两种格式
- 分页支持自动拉取全部

---

## Tech Stack

- **语言：** Node.js + TypeScript
- **CLI 框架：** `commander` (轻量、支持子命令)
- **HTTP 客户端：** 原生 `fetch`（Node 18+ 内置）
- **输出格式：** 内置 JSON pretty print + 简单表格

---

## Architecture: Schema-Driven Command Registration

核心思路：**每个 endpoint 定义为一条声明式记录**，CLI 框架自动：
1. 注册子命令 `s2a users list`、`s2a accounts get 123`
2. 校验必填/可选参数
3. 发起 HTTP 请求（自动注入 auth headers）
4. 格式化输出

```
src/
├── index.ts                 # CLI 入口
├── config.ts                # 环境变量 & 参数解析
├── client.ts                # HTTP 客户端（auth, base URL, 错误处理）
├── output.ts                # 输出格式化（json/table）
├── types.ts                 # 共享类型定义
├── commands/
│   └── index.ts             # 从 endpoints.ts 自动生成 commander 子命令
└── endpoints/
    ├── index.ts             # 汇总所有 endpoint 声明
    ├── users.ts
    ├── accounts.ts
    ├── groups.ts
    ├── dashboard.ts
    ├── settings.ts
    ├── announcements.ts
    ├── proxies.ts
    ├── redeem-codes.ts
    ├── promo-codes.ts
    ├── subscriptions.ts
    ├── usage.ts
    ├── ops.ts
    ├── system.ts
    ├── backup.ts
    ├── data-management.ts
    ├── user-attributes.ts
    ├── api-keys.ts
    ├── compliance.ts
    ├── channels.ts
    ├── channel-monitors.ts
    ├── channel-monitor-templates.ts
    ├── scheduled-test-plans.ts
    ├── error-passthrough-rules.ts
    ├── tls-fingerprint-profiles.ts
    ├── risk-control.ts
    ├── affiliates.ts
    ├── openai-oauth.ts
    ├── gemini-oauth.ts
    └── antigravity-oauth.ts
```

---

## Endpoint Schema 定义

```ts
interface EndpointDef {
  // CLI 命令路径: "users list" → s2a users list
  domain: string       // 一级子命令，如 "users", "accounts"
  action: string       // 二级子命令，如 "list", "get", "create"
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string         // 模板路径，如 "/admin/users/:id"
  
  // 参数声明
  pathParams?: ParamDef[]    // 路径参数（必填）
  queryParams?: ParamDef[]   // 查询参数
  bodyParams?: ParamDef[]    // 请求体参数
  
  // 行为标志
  isPaginated?: boolean      // 自动处理分页
  rawBody?: boolean          // 接受 stdin / --json 作为完整 body
  
  // 元信息
  description: string
  aliases?: string[]         // 命令别名，如 ["ls"] for list
}

interface ParamDef {
  name: string
  type: "string" | "number" | "boolean" | "json"
  required: boolean
  description: string
  flag?: string              // CLI flag 名，默认同 name
}
```

### 示例：Users 域的声明

```ts
export const userEndpoints: EndpointDef[] = [
  {
    domain: "users",
    action: "list",
    method: "GET",
    path: "/admin/users",
    queryParams: [
      { name: "page", type: "number", required: false, description: "页码" },
      { name: "page_size", type: "number", required: false, description: "每页数量" },
      { name: "status", type: "string", required: false, description: "状态筛选" },
      { name: "role", type: "string", required: false, description: "角色筛选" },
      { name: "search", type: "string", required: false, description: "搜索关键词" },
      { name: "group_name", type: "string", required: false, description: "分组名筛选" },
      { name: "sort_by", type: "string", required: false, description: "排序字段" },
      { name: "sort_order", type: "string", required: false, description: "asc/desc" },
    ],
    isPaginated: true,
    description: "列出所有用户",
    aliases: ["ls"],
  },
  {
    domain: "users",
    action: "get",
    method: "GET",
    path: "/admin/users/:id",
    pathParams: [
      { name: "id", type: "number", required: true, description: "用户 ID" },
    ],
    description: "获取用户详情",
  },
  {
    domain: "users",
    action: "create",
    method: "POST",
    path: "/admin/users",
    bodyParams: [
      { name: "email", type: "string", required: true, description: "邮箱" },
      { name: "password", type: "string", required: true, description: "密码" },
      { name: "username", type: "string", required: false, description: "用户名" },
      { name: "balance", type: "number", required: false, description: "初始余额" },
      { name: "concurrency", type: "number", required: false, description: "并发限制" },
      { name: "rpm_limit", type: "number", required: false, description: "RPM 限制" },
    ],
    description: "创建用户",
  },
  // ... 同理覆盖 update, delete, balance, api-keys, usage 等
]
```

---

## CLI 使用方式设计

### 环境变量配置
```bash
export SUB2API_BASE_URL="https://your-sub2api.example.com"
export SUB2API_ADMIN_KEY="admin-abcdef1234567890..."
```

也支持命令行全局参数覆盖：
```bash
s2a --url https://xxx --key admin-xxx users list
```

### 命令结构示例

```bash
# 用户管理
s2a users list                              # 列出用户（自动分页）
s2a users list --search "test" --page 2     # 搜索 + 翻页
s2a users list --all                        # 拉取所有分页
s2a users get 42                            # 获取用户 #42
s2a users create --email a@b.com --password secret --concurrency 5
s2a users update 42 --status inactive
s2a users delete 42
s2a users balance 42 --operation add --balance 100

# 账号管理
s2a accounts list
s2a accounts create --name "my-claude" --platform claude --type oauth --credentials '{"token":"..."}'
s2a accounts test 42
s2a accounts models 42

# 用户 API Keys（嵌套路由）
s2a users api-keys 42                       # 用户 #42 的 API keys
s2a users subscriptions 42                  # 用户 #42 的订阅

# 分组管理
s2a groups list
s2a groups all                              # 全部分组（不分页）
s2a groups create --name "pro" --rate_multiplier 1.0
s2a groups stats 42

# 设置
s2a settings get                            # 获取全部设置
s2a settings update --json '{"site_name":"MyAPI"}'
s2a settings admin-key get
s2a settings admin-key regenerate

# 运维监控
s2a ops concurrency
s2a ops request-errors
s2a ops alert-rules list

# 系统
s2a system version
s2a system check-updates

# 通用 raw 请求（兜底）
s2a raw GET /admin/custom/endpoint
s2a raw POST /admin/custom/endpoint --json '{"key":"value"}'
```

### 输出格式
```bash
# 默认 JSON pretty print
s2a users list

# 表格格式
s2a users list --output table

# 仅输出 data 字段（去掉 code/message 包装）
s2a users list --data-only

# 静默模式（仅输出数据，适合脚本）
s2a users list --quiet
```

---

## 关键实现细节

### 1. Auth 自动注入 (`client.ts`)
```
优先级：
1. 命令行 --key 参数
2. SUB2API_ADMIN_KEY 环境变量
3. 都没设置则报错

Header: x-api-key: <key>
```

### 2. 分页自动处理
当 `--all` 标志启用时：
- 第一次请求：拿到 total/pages
- 循环请求后续页，合并 items
- 显示进度（stderr）

### 3. 错误处理
- 响应 `code !== 0` → 以非零退出码退出，stderr 输出错误信息
- HTTP 401/403 → 明确提示 auth 问题
- 网络错误 → 显示连接诊断信息

### 4. 请求体输入
- 简单参数：`--email a@b.com --password xxx`（CLI flags）
- 复杂参数：`--json '{"key":"value"}'`（直接 JSON）
- stdin 管道：`cat body.json | s2a users create --json -`

---

## 实现阶段

### Phase 1: 基础框架（核心）
- [ ] 项目初始化 (package.json, tsconfig, build 配置)
- [ ] `config.ts` — 环境变量 + CLI 参数解析
- [ ] `client.ts` — HTTP 客户端（auth, error handling, pagination）
- [ ] `types.ts` — EndpointDef, ParamDef 类型定义
- [ ] `commands/index.ts` — 自动注册子命令框架
- [ ] `output.ts` — JSON / Table 格式化
- [ ] `raw` 命令（兜底任意请求）

### Phase 2: 核心资源域（高频使用）
- [ ] `users.ts` — 18 endpoints
- [ ] `groups.ts` — 18 endpoints
- [ ] `accounts.ts` — 42 endpoints
- [ ] `subscriptions.ts` — 12 endpoints
- [ ] `settings.ts` — 27 endpoints

### Phase 3: 运营 & 监控
- [ ] `dashboard.ts` — 13 endpoints
- [ ] `ops.ts` — 44 endpoints
- [ ] `usage.ts` — 7 endpoints
- [ ] `system.ts` — 5 endpoints

### Phase 4: 资源 & 业务
- [ ] `proxies.ts` — 14 endpoints
- [ ] `announcements.ts` — 6 endpoints
- [ ] `redeem-codes.ts` — 10 endpoints
- [ ] `promo-codes.ts` — 6 endpoints
- [ ] `channels.ts` — 7 endpoints
- [ ] `channel-monitors.ts` — 7 endpoints
- [ ] `channel-monitor-templates.ts` — 7 endpoints

### Phase 5: 高级 & 边缘功能
- [ ] `data-management.ts` — 17 endpoints
- [ ] `backup.ts` — 11 endpoints
- [ ] `user-attributes.ts` — 6 endpoints
- [ ] `api-keys.ts` — 1 endpoint
- [ ] `compliance.ts` — 2 endpoints
- [ ] `error-passthrough-rules.ts` — 5 endpoints
- [ ] `tls-fingerprint-profiles.ts` — 5 endpoints
- [ ] `scheduled-test-plans.ts` — 5 endpoints
- [ ] `risk-control.ts` — 8 endpoints
- [ ] `affiliates.ts` — 9 endpoints
- [ ] `openai-oauth.ts` — 7 endpoints
- [ ] `gemini-oauth.ts` — 3 endpoints
- [ ] `antigravity-oauth.ts` — 3 endpoints

### Phase 6: 打包 & 分发
- [ ] npm scripts: `build`, `dev` (ts-node), `bin` 配置
- [ ] 全局安装: `npm install -g .` 或 `npx s2a`
- [ ] README.md 使用文档
- [ ] `--help` 帮助文档完善

---

## 安装 & 使用方式

```bash
# 克隆项目后
npm install
npm run build

# 全局链接
npm link

# 设置环境变量（可写入 .bashrc/.zshrc）
export SUB2API_BASE_URL="https://your-instance.com"
export SUB2API_ADMIN_KEY="admin-your-key-here"

# 使用
s2a users list
s2a system version
```

---

## Risks & Mitigations

| 风险 | 缓解方案 |
|------|----------|
| ~313 个 endpoint 声明量大 | 分文件按域拆分，每文件 5-15 条声明，机械式填写 |
| sub2api 上游接口变更 | 声明式架构，改一条记录即可适配；加入版本检查 |
| 复杂请求体（嵌套 JSON） | `--json` flag 接受完整 JSON，不强求 CLI flag 展开 |
| 分页性能（大数据集） | `--all` 模式加并发控制（串行拉取避免限流） |
| WebSocket 端点 (QPS) | Phase 1 不支持，后续可加 `s2a ops watch-qps` 子命令 |
