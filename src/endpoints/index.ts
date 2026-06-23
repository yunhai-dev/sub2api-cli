import type { EndpointDef } from "../types.js";
import { userEndpoints } from "./users.js";
import { groupEndpoints } from "./groups.js";
import { accountEndpoints } from "./accounts.js";
import { subscriptionEndpoints } from "./subscriptions.js";
import { settingsEndpoints } from "./settings.js";
import { dashboardEndpoints } from "./dashboard.js";
import { opsEndpoints } from "./ops.js";
import { usageEndpoints } from "./usage.js";
import { systemEndpoints } from "./system.js";
import { proxyEndpoints } from "./proxies.js";
import { announcementEndpoints } from "./announcements.js";
import { redeemCodeEndpoints } from "./redeem-codes.js";
import { promoCodeEndpoints } from "./promo-codes.js";
import {
  channelEndpoints,
  channelMonitorEndpoints,
  channelMonitorTemplateEndpoints,
} from "./channels.js";
import { dataManagementEndpoints, backupEndpoints } from "./data-management.js";
import {
  userAttributeEndpoints,
  apiKeyEndpoints,
  complianceEndpoints,
} from "./misc.js";
import {
  errorPassthroughEndpoints,
  tlsFingerprintEndpoints,
  scheduledTestEndpoints,
} from "./rules.js";
import { riskControlEndpoints, affiliateEndpoints } from "./risk-affiliates.js";
import {
  openaiOAuthEndpoints,
  geminiOAuthEndpoints,
  antigravityOAuthEndpoints,
} from "./oauth.js";

export const allEndpoints: EndpointDef[] = [
  // Phase 2: 核心资源域
  ...userEndpoints,
  ...groupEndpoints,
  ...accountEndpoints,
  ...subscriptionEndpoints,
  ...settingsEndpoints,

  // Phase 3: 运营 & 监控
  ...dashboardEndpoints,
  ...opsEndpoints,
  ...usageEndpoints,
  ...systemEndpoints,

  // Phase 4: 资源 & 业务
  ...proxyEndpoints,
  ...announcementEndpoints,
  ...redeemCodeEndpoints,
  ...promoCodeEndpoints,
  ...channelEndpoints,
  ...channelMonitorEndpoints,
  ...channelMonitorTemplateEndpoints,

  // Phase 5: 高级功能
  ...dataManagementEndpoints,
  ...backupEndpoints,
  ...userAttributeEndpoints,
  ...apiKeyEndpoints,
  ...complianceEndpoints,
  ...errorPassthroughEndpoints,
  ...tlsFingerprintEndpoints,
  ...scheduledTestEndpoints,
  ...riskControlEndpoints,
  ...affiliateEndpoints,
  ...openaiOAuthEndpoints,
  ...geminiOAuthEndpoints,
  ...antigravityOAuthEndpoints,
];

// 按 domain 分组
export function getEndpointsByDomain(): Map<string, EndpointDef[]> {
  const map = new Map<string, EndpointDef[]>();
  for (const ep of allEndpoints) {
    if (!map.has(ep.domain)) {
      map.set(ep.domain, []);
    }
    map.get(ep.domain)!.push(ep);
  }
  return map;
}
