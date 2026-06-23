---
name: sub2api
description: >
  Manage a sub2api API gateway instance via the s2a CLI. Use when the user asks
  to manage users, accounts, groups, subscriptions, settings, proxies, ops monitoring,
  dashboards, redeem codes, promo codes, channels, backups, or any admin operation
  on a sub2api instance.
when_to_use: >
  Trigger when user mentions sub2api, s2a, API gateway admin, user management,
  account management, channel management, or any sub2api admin operation.
---

# sub2api CLI Skill

You are an expert at managing sub2api API gateway instances using the `s2a` CLI tool.

## Prerequisites

The CLI requires two environment variables:

```bash
export SUB2API_BASE_URL="https://your-sub2api-instance.com"
export SUB2API_ADMIN_KEY="admin-your-api-key"
```

Or pass them per-command: `s2a --url https://... --key admin-xxx <command>`

## Command Syntax

```
s2a <domain> <action> [positional-args] [options]
```

- **domain**: resource type (e.g. `users`, `accounts`, `groups`)
- **action**: operation (e.g. `list`, `get`, `create`, `update`, `delete`)
- **positional-args**: path params like IDs (e.g. `s2a users get 42`)
- **options**: flags like `--json`, `--page`, `--output`

## Global Options

| Option | Description | Default |
|---|---|---|
| `--url <url>` | API Base URL | `$SUB2API_BASE_URL` |
| `--key <key>` | Admin API Key | `$SUB2API_ADMIN_KEY` |
| `--output <format>` | `json` or `table` | `json` |
| `--data-only` | Only output `data` field, unwrap envelope | `false` |
| `--quiet` | Suppress output except errors | `false` |

## All 29 Command Domains

| Domain | Description | Commands |
|---|---|---|
| `users` | User management | list, get, create, update, delete, update-balance, api-keys, usage, subscriptions, etc. (19) |
| `accounts` | Account management | list, get, create, update, delete, test, refresh, models, batch, export, import, etc. (44) |
| `groups` | Group management | list, all, get, create, update, delete, stats, api-keys, subscriptions, etc. (18) |
| `subscriptions` | Subscription management | list, assign, bulk-assign, extend, revoke, etc. (8) |
| `settings` | System settings | get, update, admin-key-get, admin-key-regenerate, admin-key-delete, overload-cooldown, stream-timeout, beta-policy, web-search-emulation, etc. (26) |
| `dashboard` | Dashboard & stats | snapshot, stats, realtime, trend, models, users-ranking, etc. (13) |
| `ops` | Ops & monitoring | concurrency, realtime-traffic, account-availability, alert-rules, alert-events, request-errors, upstream-errors, system-logs, etc. (44) |
| `usage` | Usage records | list, get, export, etc. (7) |
| `system` | System management | version, check-updates, update, restart, etc. (5) |
| `proxies` | Proxy management | list, all, get, create, update, delete, test, batch, etc. (14) |
| `announcements` | Announcements | list, get, create, update, delete, etc. (6) |
| `redeem-codes` | Redeem codes | list, get, generate, batch-delete, stats, etc. (10) |
| `promo-codes` | Promo codes | list, get, create, update, delete, etc. (6) |
| `channels` | Channel management | list, get, create, update, delete, test, models, etc. (7) |
| `channel-monitors` | Channel monitors | list, get, create, update, delete, etc. (7) |
| `channel-monitor-templates` | Monitor templates | list, get, create, update, delete, etc. (7) |
| `data-management` | Data management | export, import, cleanup, etc. (17) |
| `backup` | Backup management | list, create, restore, delete, etc. (11) |
| `user-attributes` | User attributes | list, get, create, update, delete, etc. (6) |
| `api-keys` | API key management | delete, etc. (1) |
| `compliance` | Compliance | list, update, etc. (2) |
| `error-passthrough-rules` | Error passthrough rules | list, get, create, update, delete, etc. (5) |
| `tls-fingerprint-profiles` | TLS fingerprint profiles | list, get, create, update, delete, etc. (5) |
| `scheduled-test-plans` | Scheduled test plans | list, get, create, update, delete, etc. (5) |
| `risk-control` | Content risk control | list, get, create, update, delete, etc. (8) |
| `affiliates` | Affiliate/referral program | list, get, create, update, delete, stats, etc. (9) |
| `openai` | OpenAI OAuth | list, get, create, update, delete, etc. (7) |
| `gemini` | Gemini OAuth | list, get, create, etc. (3) |
| `antigravity` | Antigravity OAuth | list, get, create, etc. (3) |

Use `s2a domains` to list all domains. Use `s2a <domain> --help` to see all commands in a domain.

## Common Patterns

### List with pagination

```bash
s2a users list                              # page 1, 20 per page
s2a users list --page 2 --page-size 50      # page 2, 50 per page
s2a users list --all                        # fetch ALL pages automatically
```

### Search and filter

```bash
s2a users list --search "test"
s2a accounts list --platform claude --status active
```

### Create / Update with JSON body

```bash
# Inline JSON
s2a users create --json '{"email":"user@example.com","password":"pass123"}'

# From file
s2a accounts create --json @account.json

# From stdin
cat data.json | s2a accounts import --json -
```

### Update a specific resource

```bash
s2a users update 42 --json '{"status":"inactive"}'
s2a groups update 3 --json '{"rate_multiplier":3.0}'
```

### Delete a resource

```bash
s2a users delete 42
s2a accounts delete 7
```

### Raw request (fallback for any endpoint)

```bash
s2a raw GET /admin/custom/endpoint
s2a raw POST /admin/custom/endpoint --json '{"key":"value"}'
s2a raw GET /admin/endpoint --query "page=1&page_size=10"
```

## Output Control

```bash
# JSON (default) — full response with code/message envelope
s2a users list

# Table format — human-readable
s2a users list --output table

# Data only — unwrap the data field, useful in scripts
s2a users list --data-only

# Quiet — suppress output, only errors shown
s2a system version --data-only --quiet
```

### Scripting examples

```bash
# Get version
version=$(s2a system version --data-only --quiet | jq -r '.version')

# Get user count
total=$(s2a users list --data-only --quiet | jq '.total')
```

## Workflow Guidance

When the user asks to perform a sub2api admin task:

1. **Identify the domain** from their request (users, accounts, groups, etc.)
2. **Identify the action** (list, create, update, delete, etc.)
3. **Build the command** using the patterns above
4. **Use `--json` for complex bodies** rather than individual flags
5. **Use `--output table`** when showing results to users for readability
6. **Use `--data-only`** when piping to other commands or scripts
7. **Use `s2a <domain> --help`** if unsure about available commands

## Error Handling

| Error | Cause | Fix |
|---|---|---|
| `Missing SUB2API_BASE_URL` | Env var not set | Set env var or use `--url` |
| `Missing SUB2API_ADMIN_KEY` | Env var not set | Set env var or use `--key` |
| `API 错误 [401]` | Invalid or expired key | Check key with `s2a settings admin-key-get` |
| `API 错误 [403]` | Insufficient permissions | Verify key is admin-level |
| `API 错误 [404]` | Endpoint or resource not found | Check ID exists, verify API path |
| Network error | Cannot reach instance | Verify `SUB2API_BASE_URL` is accessible |
