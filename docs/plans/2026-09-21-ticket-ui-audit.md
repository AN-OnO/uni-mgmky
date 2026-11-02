# 工单票 UI 审验与细节统一

**日期：** 2026-09-21  
**Goal:** 在不改业务 JS 的前提下，把各页残留的灰边、圆角、窄边距、导航色差对齐到已确认工单票。

**Architecture:** 只改 template/style/`pages.json`/纯样式对象。`.ticket` 签名保留；密集列表用 face + 墨边即可，不强行每行加左轨。

**Tech Stack:** uni-app Vue3、scss、uv-ui、rpx。

## Design Read

Reading this as: 微信小程序内部工作台 for 印刷店产线人员, with 工单票 language, leaning toward 素纸 #F3E6C8 + 票面 #FFF8E7 + 朱砂状态.

Dials: VARIANCE 6 / MOTION 3 / DENSITY 7（沿用已批设计，不重开审美）。

## Optimized execution prompt

```
ROLE: uni-app 工单票 UI 实现者。不改业务。

TOKENS: paper #F3E6C8 / face #FFF8E7 / ink #1C1917 / stamp #B42318 / green #1F6B4A / perf #C4B8A1 / muted #6B6258

SPACE: 原生导航页 padding 24rpx 32rpx 40rpx；票间距 28rpx。自定义导航页再加 status-bar + 44px 避开胶囊。

NAV: navigationBarBackgroundColor 一律 #F3E6C8。

SURFACE: 直角；#333→ink；#ccc 分割→perf dashed；uv-subsection/action-sheet 去圆角。

DO NOT: apis/store/config/unpackage；data/methods/API/跳转/v-model；loading:true 改 false；ROUTE_GUARD 现保持 false。

PREVIEW: 无登录可看壳和空态；loading 遮罩、图表、列表密度仍依赖接口。
```

## Code review（按严重度）

1. **High — 预览开关：** `ROUTE_GUARD_ENABLED=false` 路由+401 都不跳登录。提交前必须改回 true。
2. **High — 加载遮罩：** `productionReport/list|info|batch|confirm`、`logistics/info|search|newInfo`、`statisticalForm` 默认 `loading: true`。无接口时可能一直遮住页面。改它属于业务，本轮不动。
3. **Med — 胶囊压票：** 个人中心自定义导航，票头 STAFF/IN 与微信胶囊重叠。
4. **Med — 间距不齐：** 报工已对齐；补卡/考勤记录/绑定仍 24rpx 或负 margin。
5. **Low — 登录标题：** `appName = ''`，票上品牌名为空。改常量算 JS，本轮不填假名。
6. **Low — uv 控件：** subsection `border-radius: 15rpx`、action-sheet `round="16"` 仍是旧圆角。
7. **Info — 无票轨页：** 新版物流/返单列表用 face+墨边，不用每行 `.ticket` 左轨（密集列表会糊）。
8. **Info — 考勤记录/补卡记录** 有本地 mock，无登录也能看列表密度。
