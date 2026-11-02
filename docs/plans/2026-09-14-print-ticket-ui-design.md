# 工单票 UI 重构设计

**日期：** 2026-09-14  
**产品：** uni-mgmky 微信小程序（印刷店/产线工作台）  
**状态：** 视觉系统已确认（工单票/热敏票据风）

## Design Read

Reading this as: 微信小程序内部工作台 for 印刷店产线人员, with 工单票 / 热敏小票 language, leaning toward 暖色素纸底 + 炭黑字 + 朱砂状态，而非 uv-ui 浅蓝企业风，也非已撤回的浅色工业叠卡。

## 三档

| Dial | Value | 理由 |
|------|-------|------|
| DESIGN_VARIANCE | 6 | 全面换皮，但车间工具不能玩实验排版 |
| MOTION_INTENSITY | 3 | 手套操作、弱网；只用 150–200ms opacity/transform |
| VISUAL_DENSITY | 7 | 维持现有信息量，用票面分区而不是加大留白把入口藏掉 |

## 约束（硬）

1. **业务逻辑不变：** 登录校验、接口、跳转、`handleToolEvent`、扫码、权限显示条件全部不动。
2. **JS 业务零改：** 不改 `<script>` 里的 data、computed、方法、API。仅允许改 template / style；若 `loginBtnStyle` 等纯样式对象挡路，只动样式对象本身。
3. **工程形态：** 改的是 uni-app Vue SFC 的 `<template>` + `<style>`，编译产物才是 WXML/WXSS。不直接改 `unpackage/`。
4. **降低原版相似度：** 去掉居中 Logo + 白底圆角卡片 + `#e2efff` / `#D5E8FF` 导航条。
5. **小程序限制：** 不用 Google Fonts、不用 `backdrop-filter` 当主效果、触摸目标 ≥ 88rpx。

## 调色（命名 hex）

| Token | Hex | 用途 |
|-------|-----|------|
| `--ticket-paper` | `#F3E6C8` | 页面底（素纸） |
| `--ticket-face` | `#FFF8E7` | 票面 |
| `--ink-black` | `#1C1917` | 主文字 |
| `--stamp-red` | `#B42318` | 主操作 / 紧急状态（朱砂盖章） |
| `--ink-green` | `#1F6B4A` | 成功 / 已完成 |
| `--perf-line` | `#C4B8A1` | 齿孔、虚线撕口 |

辅助：`--ink-muted` `#6B6258`，`--rail-width` `8rpx`。

对比度：炭黑字在素纸/票面上均 > 7:1；朱砂按钮用白字，大按钮字号 ≥ 18px。

## 字体

小程序无法稳定加载外链字体。

- **票面标题：** PingFang SC / Source Han Sans，`font-weight: 700`，字距 `0.08em`，像盖章标题。
- **工单号 / 数字：** `ui-monospace, "SF Mono", "Menlo", Consolas, monospace` + `font-variant-numeric: tabular-nums`。
- **正文：** 系统黑体 28–32rpx，行高 1.45。

禁止 Inter / Roboto 作标题；不用衬线当默认。

## 布局概念

签名元素（全站只这一个记忆点）：**票面左侧 8rpx 墨条 + 顶部等宽单号 + 中间虚线撕口。**

```
┌ 素纸底 ─────────────────┐
│ ┌票面──────────────┐   │
│ │█ JOB  20260914   │   │  ← 等宽单号
│ │█ 入厂工牌         │   │
│ │█ ··············· │   │  ← 撕口
│ │█ 账号             │   │
│ │█ 密码             │   │
│ │█ [ 登录 朱砂满底 ] │   │
│ └──────────────────┘   │
└────────────────────────┘
```

首页：上联「主入口票」（绩效收益 / 统计报表，仍走原 `menu`），下联「常用工具票」（原 `tools` 网格）。Tab 改成票根式底栏：未选齿孔灰，选中朱砂字 + 顶线。

## 交互不变清单

- 登录：`v-model="loginForm.*"`、`handlePassword`、`handleLogin`、原校验文案。
- 首页：`v-if="item.display"`、`@tap="handleToolEvent(item)"`、图标 `item.icon` / `item.topIcon`。
- 自定义 tabBar 页面路径不变。

## 明确不做

- 不改接口、权限、扫码、AppID、baseURL。
- 不上新图标库（继续用现有 svg/png）。
- 不做玻璃拟态、紫渐变、三等分 Hero 卡、上一版叠卡。
- 不改 `unpackage/dist` 手写 WXML。

## 验收

- 登录/首页与原版并排截图，第一眼不像浅蓝 uv-ui。
- 点登录、点每个 `display:true` 的工具，跳转与改前一致。
- 空/错/加载不出现空白屏（沿用现有分支，只换皮）。
- 微信开发者工具里 375 宽无横向滚动。
