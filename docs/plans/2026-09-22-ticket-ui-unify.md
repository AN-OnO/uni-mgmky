# 工单票 UI 全站细节统一 Implementation Plan

> **For implementer:** 无页面测试。用 `node scripts/check-ticket-tokens.mjs` 作表征检查。禁止改业务 script。`报工详情v1版本.vue` 不在路由里，跳过。不提交、不改 `ROUTE_GUARD_ENABLED`。

**Goal:** 在不改业务 JS 的前提下，把残留灰字、纯黑描边、硬阴影、缺导航底色、页边距不齐对齐到已确认工单票。

**Architecture:** 只改 template 展示色 / style / `pages.json` 导航色。`.ticket` 用半透明墨边 + 浅暖投影；密集列表不强行左轨。

**Tech Stack:** uni-app Vue3、scss、uv-ui、rpx、微信小程序。

## Design Read

Reading this as: 微信小程序内部工作台 for 印刷店产线人员, with 工单票/热敏小票 language, leaning toward 暖色素纸 + 炭黑字 + 朱砂状态.

Dials: VARIANCE 6 / MOTION 3 / DENSITY 7（沿用已批设计，不重开审美）。

## Optimized execution prompt

```
ROLE
uni-app Vue3 微信小程序 UI 实现者。产品是印刷店产线工作台。

DESIGN READ
Reading this as: 微信小程序内部工作台 for 产线人员, with 工单票 language,
leaning toward 素纸 #F3E6C8 + 票面 #FFF8E7 + 朱砂状态.

DIALS
VARIANCE 6 / MOTION 3 / DENSITY 7

TOKENS
--ticket-paper #F3E6C8
--ticket-face  #FFF8E7
--ink-black    #1C1917
--stamp-red    #B42318
--ink-green    #1F6B4A
--perf-line    #C4B8A1
--ink-muted    #6B6258
票边           rgba(28,25,23,.38)
票影           4rpx 4rpx 0 rgba(28,25,23,.1), 0 10rpx 24rpx rgba(92,64,32,.08)

SIGNATURE
票面左 8rpx 墨条 + 虚线撕口。直角。禁止圆角白卡、紫渐变、玻璃拟态、Google Fonts。
卡片不要纯黑 8rpx 硬阴影；头像圆形无墨框；日/月/累计无黑框。

HARD CONSTRAINTS
1. 不改 <script> 业务：data/computed/methods/API/跳转/v-model/权限 v-if。
2. 允许改 template 展示色、style、pages.json 导航色、loginBtnStyle 等纯样式对象。
3. 不改 apis/、store/、common/config.ts、unpackage/。
4. 触摸目标 ≥ 88rpx。
5. 不改 loading:true（业务）。ROUTE_GUARD 保持 false。

NAV
原生导航页 navigationBarBackgroundColor = #F3E6C8。
页边距 24rpx 32rpx 40rpx。自定义导航再加 status-bar + 胶囊。

SURFACE
#333/#1D2129 → ink；#808080/#999 → muted；#fff 大底 → face（按钮白字保留）。
2rpx solid ink-black 卡片边 → 半透明票边。企业蓝阴影去掉。

DO NOT
改登录校验、扫码、baseURL。不上新图标库。不把手写 dist 当源码。
```

## Tasks

1. pages.json 缺导航底色的页补 #F3E6C8
2. 正文色/分割/卡片边/硬阴影统一到 token
3. 补卡 tab、收益页边距、弹层白底对齐
4. 表征检查 + 汇报无登录搞不定的点
