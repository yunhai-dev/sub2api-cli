# sub2api-cli

[sub2api](https://github.com/Wei-Shaw/sub2api) 全量 Admin API 命令行工具，覆盖全部 **323 个** admin 接口，29 个资源域。

[![npm](https://img.shields.io/npm/v/sub2api-cli)](https://www.npmjs.com/package/sub2api-cli)
[![license](https://img.shields.io/npm/l/sub2api-cli)](./LICENSE)
[![skills](https://img.shields.io/badge/agent--skills-compatible-brightgreen)](https://agentskills.io)

---

## 安装

### 方式一：npx 直接使用（推荐，无需安装）

```bash
npx sub2api-cli --help
```

### 方式二：全局安装

```bash
npm install -g sub2api-cli
```

安装后即可直接使用 `s2a` 命令：

```bash
s2a --help
```

### 方式三：从源码构建

```bash
git clone https://github.com/your-username/sub2api-cli.git
cd sub2api-cli
npm install
npm run build
npm link    # 全局链接，之后可直接用 s2a
```

---

## Agent Skill（AI Agent 集成）

本项目内置 [Agent Skill](https://agentskills.io)，支持 Claude Code、VS Code Copilot、Cursor、Codex 等 70+ AI Agent。安装后 Agent 可自动识别并使用 `s2a` CLI。

### 安装 Skill

通过 [`npx skills`](https://github.com/vercel-labs/skills) 一键安装（推荐）：

```bash
# 安装到当前项目
npx skills add yunhai-dev/sub2api-cli

# 全局安装（所有项目可用）
npx skills add yunhai-dev/sub2api-cli -g

# 指定 Agent 安装
npx skills add yunhai-dev/sub2api-cli -a claude-code
npx skills add yunhai-dev/sub2api-cli -a copilot -a cursor

# 查看可用的 Skills
npx skills add yunhai-dev/sub2api-cli --list
```

### 支持的 Agent

Claude Code、VS Code Copilot、Cursor、OpenAI Codex、OpenCode、Roo Code、Goose、Amp、Kiro 等 70+ Agent。

安装后在 Agent 中输入 `/sub2api` 即可调用，或直接用自然语言描述需求（如 "列出所有用户"），Agent 会自动加载 Skill 并执行对应命令。

---

## 配置

### 环境变量（推荐）

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
export SUB2API_BASE_URL="https://your-sub2api-instance.com"
export SUB2API_ADMIN_KEY="admin-your-api-key-here"
```

然后重新加载：

```bash
source ~/.zshrc
```

### 命令行参数

也可以通过 `--url` 和 `--key` 临时指定，优先级高于环境变量：

```bash
s2a --url https://api.example.com --key admin-xxx users list
```

> **获取 Admin API Key**：登录 sub2api 管理后台 → 设置 → Admin API Key，或使用命令 `s2a settings admin-key-get`。

---

## 快速开始

```bash
# 查看系统版本
s2a system version

# 列出所有用户
s2a users list

# 查看全部可用命令域
s2a domains
```

---

## 使用指南

### 用户管理

```bash
# 列出用户（分页）
s2a users list
s2a users list --page 2 --page-size 50
s2a users list --search "test"          # 搜索
s2a users list --status active          # 按状态筛选
s2a users list --all                    # 拉取全部分页数据

# 获取用户详情
s2a users get <用户ID>

# 创建用户
s2a users create --json '{
  "email": "user@example.com",
  "password": "your-password",
  "concurrency": 5,
  "rpm_limit": 60
}'

# 更新用户
s2a users update <用户ID> --json '{"status": "inactive"}'

# 删除用户
s2a users delete <用户ID>

# 更新余额（充值/扣减）
s2a users update-balance <用户ID> --json '{
  "balance": 100,
  "operation": "add",
  "notes": "充值"
}'

# 查看用户的 API Keys
s2a users api-keys <用户ID>

# 查看用户用量
s2a users usage <用户ID>

# 查看用户订阅
s2a users subscriptions <用户ID>
```

### 账号管理

```bash
# 列出账号
s2a accounts list
s2a accounts list --platform claude --status active

# 创建账号
s2a accounts create --json '{
  "name": "my-claude-account",
  "platform": "claude",
  "type": "oauth",
  "credentials": {"token": "your-oauth-token"},
  "concurrency": 10,
  "priority": 1,
  "group_ids": [1, 2]
}'

# 测试账号连通性
s2a accounts test <账号ID>

# 刷新账号
s2a accounts refresh <账号ID>

# 获取可用模型列表
s2a accounts models <账号ID>

# 批量创建
s2a accounts batch --json '{"accounts": [...]}'

# 导出账号数据
s2a accounts export

# 导入账号数据
s2a accounts import --json '...'
```

### 分组管理

```bash
# 列出分组
s2a groups list
s2a groups all                          # 全部分组（不分页）

# 创建分组
s2a groups create --json '{
  "name": "pro",
  "platform": "anthropic",
  "rate_multiplier": 2.0,
  "is_exclusive": false
}'

# 更新分组
s2a groups update <分组ID> --json '{"rate_multiplier": 3.0}'

# 删除分组
s2a groups delete <分组ID>

# 查看分组统计
s2a groups stats <分组ID>

# 获取分组的 API Keys
s2a groups api-keys <分组ID>

# 获取分组的订阅
s2a groups subscriptions <分组ID>
```

### 订阅管理

```bash
# 列出订阅
s2a subscriptions list
s2a subscriptions list --user-id 1 --group-id 2

# 分配订阅给用户
s2a subscriptions assign --json '{
  "user_id": 1,
  "group_id": 2,
  "validity_days": 30
}'

# 批量分配
s2a subscriptions bulk-assign --json '{
  "user_ids": [1, 2, 3],
  "group_id": 2,
  "validity_days": 30
}'

# 延长订阅
s2a subscriptions extend <订阅ID> --json '{"days": 30}'

# 撤销订阅
s2a subscriptions revoke <订阅ID>
```

### 系统设置

```bash
# 获取全部设置
s2a settings get

# 更新设置
s2a settings update --json '{"site_name": "MyAPI"}'

# Admin API Key 管理
s2a settings admin-key-get              # 查看状态
s2a settings admin-key-regenerate       # 重新生成
s2a settings admin-key-delete           # 删除

# 子设置项
s2a settings overload-cooldown          # 过载冷却
s2a settings stream-timeout             # 流超时
s2a settings beta-policy                # Beta 策略
s2a settings web-search-emulation       # Web Search 模拟
```

### 代理管理

```bash
# 列出代理
s2a proxies list
s2a proxies all                         # 全部（不分页）

# 创建代理
s2a proxies create --json '{
  "name": "my-proxy",
  "protocol": "http",
  "host": "127.0.0.1",
  "port": 7890
}'

# 测试代理
s2a proxies test <代理ID>

# 批量创建
s2a proxies batch --json '{"proxies": [...]}'
```

### 仪表盘 & 统计

```bash
s2a dashboard snapshot                   # 仪表盘快照
s2a dashboard stats                      # 统计数据
s2a dashboard realtime                   # 实时指标
s2a dashboard trend                      # 用量趋势
s2a dashboard models                     # 模型统计
s2a dashboard users-ranking              # 用户消费排行
```

### 运维监控

```bash
# 实时状态
s2a ops concurrency                      # 并发统计
s2a ops realtime-traffic                 # 实时流量
s2a ops account-availability             # 账号可用性

# 告警管理
s2a ops alert-rules                      # 告警规则列表
s2a ops alert-events                     # 告警事件列表
s2a ops create-alert-rule --json '...'   # 创建告警规则

# 错误日志
s2a ops request-errors                   # 请求错误
s2a ops upstream-errors                  # 上游错误
s2a ops resolve-request-error <错误ID>   # 标记已解决

# 系统日志
s2a ops system-logs                      # 系统日志
s2a ops dashboard-snapshot               # 运维仪表盘
```

### 兑换码 & 优惠码

```bash
# 兑换码
s2a redeem-codes list
s2a redeem-codes generate --json '{
  "count": 10,
  "type": "balance",
  "value": 100
}'
s2a redeem-codes stats

# 优惠码
s2a promo-codes list
s2a promo-codes create --json '...'
```

### 系统管理

```bash
s2a system version                       # 当前版本
s2a system check-updates                 # 检查更新
s2a system update --json '{}'            # 执行更新
s2a system restart                       # 重启服务
```

### 兜底：原始请求

对于任何未覆盖或新增的接口，使用 `raw` 命令直接发送请求：

```bash
# GET 请求
s2a raw GET /admin/some/new/endpoint

# POST 请求
s2a raw POST /admin/some/endpoint --json '{"key": "value"}'

# 带查询参数
s2a raw GET /admin/some/endpoint --query "page=1&page_size=10"

# 从文件读取请求体
s2a raw POST /admin/some/endpoint --json @body.json

# 从 stdin 读取
cat body.json | s2a raw POST /admin/some/endpoint --json -
```

---

## 全局选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--url <url>` | API Base URL | 读取 `SUB2API_BASE_URL` 环境变量 |
| `--key <key>` | Admin API Key | 读取 `SUB2API_ADMIN_KEY` 环境变量 |
| `--output <format>` | 输出格式：`json` 或 `table` | `json` |
| `--data-only` | 仅输出 data 字段，去掉 code/message 包装 | `false` |
| `--quiet` | 静默模式，仅错误时输出 | `false` |
| `--version` | 显示版本号 | |
| `--help` | 显示帮助 | |

---

## 输出格式

### JSON（默认）

```bash
s2a users list
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "total": 42,
    "page": 1,
    "page_size": 20,
    "pages": 3
  }
}
```

### 表格

```bash
s2a users list --output table
```

```
id    email              role    status    balance
--    -----              ----    ------    -------
1     admin@example.com  admin   active    10000
2     user@example.com   user    active    500

共 2 条记录，当前第 1/1 页
```

### 仅 data 字段

```bash
s2a users list --data-only
```

```json
{
  "items": [...],
  "total": 42
}
```

### 在脚本中使用

```bash
# 获取版本号
version=$(s2a system version --data-only --quiet | jq -r '.version')

# 获取用户数量
total=$(s2a users list --data-only --quiet | jq '.total')
```

---

## 分页

所有 `list` 命令支持分页参数：

```bash
s2a users list --page 2 --page-size 50    # 第2页，每页50条
s2a users list --all                      # 自动拉取全部分页并合并
```

---

## 全部命令域

| 域 | 命令 | 说明 |
|----|------|------|
| `users` | `s2a users` | 用户管理（19 个命令） |
| `groups` | `s2a groups` | 分组管理（18 个命令） |
| `accounts` | `s2a accounts` | 账号管理（44 个命令） |
| `subscriptions` | `s2a subscriptions` | 订阅管理（8 个命令） |
| `settings` | `s2a settings` | 系统设置（26 个命令） |
| `dashboard` | `s2a dashboard` | 仪表盘（13 个命令） |
| `ops` | `s2a ops` | 运维监控（44 个命令） |
| `usage` | `s2a usage` | 用量记录（7 个命令） |
| `system` | `s2a system` | 系统管理（5 个命令） |
| `proxies` | `s2a proxies` | 代理管理（14 个命令） |
| `announcements` | `s2a announcements` | 公告管理（6 个命令） |
| `redeem-codes` | `s2a redeem-codes` | 兑换码管理（10 个命令） |
| `promo-codes` | `s2a promo-codes` | 优惠码管理（6 个命令） |
| `channels` | `s2a channels` | 渠道管理（7 个命令） |
| `channel-monitors` | `s2a channel-monitors` | 渠道监控（7 个命令） |
| `channel-monitor-templates` | `s2a channel-monitor-templates` | 渠道监控模板（7 个命令） |
| `data-management` | `s2a data-management` | 数据管理（17 个命令） |
| `backup` | `s2a backup` | 备份管理（11 个命令） |
| `user-attributes` | `s2a user-attributes` | 用户属性（6 个命令） |
| `api-keys` | `s2a api-keys` | API Key 管理（1 个命令） |
| `compliance` | `s2a compliance` | 合规管理（2 个命令） |
| `error-passthrough-rules` | `s2a error-passthrough-rules` | 错误透传规则（5 个命令） |
| `tls-fingerprint-profiles` | `s2a tls-fingerprint-profiles` | TLS 指纹配置（5 个命令） |
| `scheduled-test-plans` | `s2a scheduled-test-plans` | 定时测试计划（5 个命令） |
| `risk-control` | `s2a risk-control` | 内容风控（8 个命令） |
| `affiliates` | `s2a affiliates` | 邀请返利（9 个命令） |
| `openai` | `s2a openai` | OpenAI OAuth（7 个命令） |
| `gemini` | `s2a gemini` | Gemini OAuth（3 个命令） |
| `antigravity` | `s2a antigravity` | Antigravity OAuth（3 个命令） |

使用 `s2a <域> --help` 查看该域下所有可用命令。

---

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `SUB2API_BASE_URL` | sub2api 实例地址 | `https://api.example.com` |
| `SUB2API_ADMIN_KEY` | Admin API Key | `admin-abc123...` |

---

## 常见问题

### npx 报错 `command not found`

如果在项目目录内运行 `npx sub2api-cli` 出现此错误，请切换到非项目目录再执行，或使用全局安装方式。

### 认证失败

确保 Admin API Key 格式正确（以 `admin-` 开头），且该 Key 在 sub2api 后台中处于启用状态。

### 网络连接失败

确认 `SUB2API_BASE_URL` 不含尾部斜杠，且该地址可从当前网络环境访问。

---

## 许可证

MIT
