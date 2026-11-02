# 工单票 UI 全站统一 Implementation Plan

> **For implementer:** 无页面测试。用 `node scripts/check-ticket-tokens.mjs` 作表征检查。禁止改业务 script。`报工详情v1版本.vue` 不在路由里，跳过。

**Goal:** 未登录也能预览每一页，并把残留灰蓝白卡统一到已确认的工单票视觉。

**Architecture:** 预览开关复用 `ROUTE_GUARD_ENABLED`。各页只改 template/style/`pages.json` 导航色/纯样式对象。页底素纸、卡片票面、朱砂主操作。

**Tech Stack:** uni-app Vue3、scss、uv-ui、rpx、微信小程序。

**设计文档:** `docs/plans/2026-09-14-print-ticket-ui-design.md`

---

## Optimized execution prompt

```
ROLE
uni-app Vue3 微信小程序 UI 实现者。产品是印刷店产线工作台，不是 ToC 营销站。

DESIGN READ
Reading this as: 微信小程序内部工作台 for 产线人员, with 工单票/热敏小票 language, leaning toward 暖色素纸 + 炭黑字 + 朱砂状态.

DIALS
VARIANCE 6 / MOTION 3 / DENSITY 7

TOKENS (must use CSS vars, not invent new palette)
--ticket-paper #F3E6C8  page
--ticket-face  #FFF8E7  card
--ink-black    #1C1917  text/border
--stamp-red    #B42318  primary/danger
--ink-green    #1F6B4A  success
--perf-line    #C4B8A1  dashed tear
--ink-muted    #6B6258  captions
--rail-width   8rpx

SIGNATURE (one memory)
票面左 8rpx 墨条 + 等宽票号 + 虚线撕口。直角。禁止圆角白卡、紫渐变、玻璃拟态、Google Fonts。

HARD CONSTRAINTS
1. 不改 <script> 业务：data/computed/methods/API/跳转/v-model/权限 v-if。
2. 允许改 template 结构、style、pages.json 导航色、loginBtnStyle 等纯样式对象。
3. 不改 apis/、store/、common/config.ts、unpackage/。
4. 触摸目标 ≥ 88rpx。
5. 提交前必须把 ROUTE_GUARD_ENABLED 改回 true。

NAV RULE
- 自定义导航页（login / tabbar/*）：padding-top = status-bar + 24px；不要用未占位的 fixed uv-navbar。
- 原生导航页：不要再加 status-bar padding；navigationBarBackgroundColor = #F3E6C8。

SURFACE MAP
页底/sticky     paper
卡片/搜索框     face + 2rpx ink 边，border-radius 0
主按钮         stamp-red + 白字 + 直角
成功           ink-green
禁用/次要文字   ink-muted
禁止残留       #fff 大底、#f5f5f5、#F2F3F5、#E8F3FF、#1576ED、#e2efff、#D5E8FF

PREVIEW (cannot login)
ROUTE_GUARD_ENABLED === false 时：
- 路由守卫放行（已有）
- HTTP 401 / 业务码 1001 不 toast「登录失效」、不 toLogin
页面空数据仍要能看见布局（沿用现有 v-if/empty）。

DO NOT
改登录校验逻辑、扫码、baseURL。不上新图标库。不把手写 dist WXML 当源码。
```

---

### Task 1: 预览开关接到 HTTP 层

**Files:**
- Modify: `utils/request.ts`

`toLogin()` 与「登录失效」toast 仅在 `ROUTE_GUARD_ENABLED === true` 时执行。

### Task 2: 原生导航白底

**Files:**
- Modify: `pages.json` 中 `#fff` 导航改为 `#F3E6C8`

### Task 3: 未换皮页统一票面

残留页：返单三页、报工 return_order/confirm/batch 白卡、物流 newList/newSearch/newInfo/info/upload/newUpload、补卡 records、日报/绩效/统计残留白底。

只改颜色、圆角、sticky/search 背景；点击绑定不动。

### Task 4: 表征检查

```
node scripts/check-ticket-tokens.mjs
```

Expected: `ok`
