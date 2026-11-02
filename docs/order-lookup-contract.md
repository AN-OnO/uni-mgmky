# 查看订单接口约定

状态：前端已用本地示例数据走通交互，后端按本文对接后替换 `pages/orderLookup/orders.js`。

页面：

- `GET` 风格的查询：`pages/orderLookup/index`
- 详情：`pages/orderLookup/detail?orderItemNo=`

不按工艺、配送方式过滤。一张销售单可以有多条子单，列表以子单 `orderItemNo` 为一行。

## 1. 搜索

建议路径：`POST /api/Order/Search`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| keyword | string | 否 | 用户输入。匹配销售单号、子单号、客户名、品名、联系人、手机号、当前工艺 |
| scanCode | string | 否 | 扫码原文。与 keyword 至少传一个 |
| pageIndex | number | 是 | 从 1 开始 |
| pageSize | number | 是 | 建议 10 |

`keyword` 与 `scanCode` 都空时不要返回全量，返回空列表。

响应 `data`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| count | number | 总条数 |
| pageEntities | OrderCard[] | 当前页 |

OrderCard：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| orderItemNo | string | 子单号，详情主键 |
| saleOrderNo | string | 销售单号，票面大号 |
| companyName | string | 客户名 |
| contactName | string | 联系人 |
| contactMobile | string | 手机号 |
| productName | string | 品名 |
| quantity | number | 数量 |
| unit | string | 张 / 枚 / 本 |
| status | string | `producing` / `pending_delivery` / `delivered` |
| statusDesc | string | 生产中 / 待配送 / 已完成 |
| currentTechnologyName | string | 当前工序 |
| checkintime | string | `YYYY-MM-DD HH:mm` |

## 2. 详情

建议路径：`POST /api/Order/Detail`

请求：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| orderItemNo | string | 是 | 列表带过来的子单号 |

响应 `data` 在 OrderCard 上增加：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| spec | string | 规格，如尺寸、色数、后道 |
| amount | number | 金额，单位元 |
| deliveryMethodDesc | string | 店内配送 / 物流 / 客户自提 |
| deliveryAddress | string | 收货或自提地址 |
| remark | string | 没有则空字符串 |
| technologies | TechnologyStep[] | 按工艺顺序 |

TechnologyStep：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 工序名 |
| status | string | `wait` / `doing` / `done` |
| statusDesc | string | 未开始 / 进行中 / 已完成 |
| operatorName | string | 操作人，未开始可空 |
| finishedAt | string | 完成时间，未完成则空字符串 |

找不到子单时 `code !== 0`，`message` 写明原因。前端详情页已有空状态。
