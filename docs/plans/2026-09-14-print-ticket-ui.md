# 工单票 UI 重构 Implementation Plan

> **For implementer:** 本仓库没有页面级测试。每个任务先加/跑 token 检查脚本（表征测试），再改 template/style。禁止改业务 script。

**Goal:** 在不改动业务 JS 的前提下，把 uni-mgmky 微信小程序从 uv-ui 浅蓝企业风换成工单票视觉语言。

**Architecture:** 全局 token 放 `static/css/ticket-tokens.scss`，由 `App.vue` 引入。各页只改 `<template>` 结构与 `<style>`；`:deep()` 覆盖 uv-ui。`pages.json` 导航栏色改为素纸/票面色。

**Tech Stack:** uni-app Vue3 `<script setup>`（不改逻辑）、scss、uv-ui、rpx。

**设计文档:** `docs/plans/2026-09-14-print-ticket-ui-design.md`

---

### Task 1: Token 文件与检查脚本

**Files:**
- Create: `static/css/ticket-tokens.scss`
- Create: `scripts/check-ticket-tokens.mjs`
- Modify: `App.vue`（仅 `<style>` 增加 import）
- Modify: `uni.scss`（把 `$uni-color-primary` 等同步为票面色，避免 uv 默认蓝）

**Step 1: Write the failing check**

`scripts/check-ticket-tokens.mjs` 读取 `static/css/ticket-tokens.scss`，断言包含：

`--ticket-paper: #F3E6C8`、`--ticket-face: #FFF8E7`、`--ink-black: #1C1917`、`--stamp-red: #B42318`、`--ink-green: #1F6B4A`、`--perf-line: #C4B8A1`

**Step 2: Run — confirm it fails**

```
node scripts/check-ticket-tokens.mjs
```

Expected: FAIL — file missing or tokens missing.

**Step 3: Minimal implementation**

```scss
page {
  --ticket-paper: #F3E6C8;
  --ticket-face: #FFF8E7;
  --ink-black: #1C1917;
  --stamp-red: #B42318;
  --ink-green: #1F6B4A;
  --perf-line: #C4B8A1;
  --ink-muted: #6B6258;
  --rail-width: 8rpx;
  background-color: var(--ticket-paper);
  color: var(--ink-black);
}
.ticket {
  background: var(--ticket-face);
  border: 2rpx solid var(--ink-black);
  box-shadow: 8rpx 8rpx 0 var(--ink-black);
  position: relative;
  padding-left: 24rpx;
}
.ticket::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--rail-width);
  background: var(--stamp-red);
}
.ticket-no {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.12em;
  font-size: 22rpx;
  color: var(--ink-muted);
}
.ticket-perf {
  border-top: 2rpx dashed var(--perf-line);
  margin: 24rpx 0;
}
```

App.vue style 增加 `@import "@/static/css/ticket-tokens.scss";`

**Step 4: Run — confirm it passes**

```
node scripts/check-ticket-tokens.mjs
```

Expected: PASS（打印 `ok`）。

**Step 5: Commit**（仅当用户明确要求提交时）

---

### Task 2: pages.json 导航条去蓝

**Files:**
- Modify: `pages.json`

把所有 `#e2efff` `#D5E8FF` `#E6F1FF` `#F0F1F5` `#F8F8F8` 导航/背景换成 `#F3E6C8` 或 `#FFF8E7`。`tabBar.backgroundColor` = `#FFF8E7`，`selectedColor` = `#B42318`，`color` = `#6B6258`。

不改任何 `path`。

---

### Task 3: 登录页工牌

**Files:**
- Modify: `pages/index/login.vue`（仅 template + style；`loginBtnStyle`/`formItemStyle` 若必须改，只改对象字面量颜色）

**结构：** 外层素纸 → `.ticket` → 状态栏 → `.ticket-no`（可用静态 `JOB LOGIN`，不要新 script 变量）→ Logo+标题 → `.ticket-perf` → 原 `uv-form` / `uv-button` 原绑定全部保留。

`:deep(.uv-button)` 做成朱砂满底白字，圆角 0。

**验证：** `handleLogin`、`v-model`、密码眼睛 `@click="handlePassword"` 仍在；git diff 的 script 除样式对象外为空。

---

### Task 4: 首页上下联票

**Files:**
- Modify: `pages/tabbar/home.vue`（仅 template + style）

上联 `.ticket` 包原 `menu` 循环；下联另一张 `.ticket` 包 `tools`。禁止改 `appMenus` / `handleToolEvent`。网格改为 3 列，左色条区分主入口（朱砂）与工具（油墨绿可用 CSS 修饰，不要改数据）。

**验证：** 每个 `@tap="handleToolEvent(item)"` 仍在；`v-if="item.display"` 仍在。

---

### Task 5: 自定义 Tab + 我的

**Files:**
- Modify: `pages/tabbar/index.vue`（tab 壳，若存在自定义 tab 组件一并改 style）
- Modify: `pages/tabbar/user.vue`
- Modify: `pages/tabbar/earning.vue`
- Modify: `pages/tabbar/bind.vue`

票根底栏：顶 2rpx 实线，选中项朱砂。我的页用一张票列出原入口，不改点击函数。

---

### Task 6: 考勤分包

**Files:**
- `pages/check/check.vue`
- `pages/check/attendance.vue`
- `pages/check/apply/apply.vue`
- `pages/check/apply/index.vue`
- `pages/check/apply/records.vue`

打卡主按钮做成朱砂大方块（圆角 0），记录列表做成撕口行。不改定位/打卡 API。

---

### Task 7: 报工 / 绩效 / 统计

**Files:**
- `pages/productionReport/*.vue`（不含 `报工详情v1版本.vue`）
- `pages/performanceGain/index.vue`
- `pages/performanceGain/detail.vue`
- `pages/statisticalForm/index.vue`
- `pages/statisticalForm/components/rankTable.vue`

列表行：左轨 + 等宽单号（用已有字段，template 加 class，不新算字段）。筛选条贴票顶。

---

### Task 8: 配送 / 物流 / 返单 / 日报 / 扫码

**Files:**
- `pages/logistics/*.vue`
- `pages/returnOrder/*.vue`
- `pages/dailyReport/dailyReport.vue`
- `pages/saomiao/saomiao.vue`
- `pages/webview/webview.vue`（仅背景，不改 webview 行为）

---

### Task 9: 回归

1. `node scripts/check-ticket-tokens.mjs`
2. `git diff --stat`：不应出现 `apis/`、`store/`、`common/config.ts`（除用户已有本地 baseURL）。
3. 对每个改过的 `.vue`：`git diff` 确认 `<script` 块无业务改动。
4. 微信开发者工具导入 `unpackage/dist/dev/mp-weixin`：登录 → 首页点绩效/考勤/报工各一次。

---

## 每页改 template 时的禁令

- 不新增 `ref`/`computed`/`watch`（除非纯 CSS 无法实现且不改变行为，需在任务里注明）。
- 不改 `@tap` / `@click` 绑定的函数名。
- 不改 `v-model` 字段名。
- 不删除 `v-if` 权限分支。
