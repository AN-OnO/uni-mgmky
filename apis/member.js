import request from "@/utils/request";

/**
 * 用户账密登录
 * @param params 
 * @return 
 */
export function Login(params) {
	return request.post('/api/UserMgr/Login', params);
}

/**
 * 获取图片验证码
 * @param params 
 * @return 
 */
export function VCode(params) {
	return request.post('/api/UserMgr/VCode', params);
}

/**
 * 根据用户账号获取Token
 * @param params 
 * @return 
 */
export function GetToken(params) {
	return request.post('/api/UserMgr/GetToken', params);
}

/**
 * 获取物流、配送列表
 * @param params 
 * @return 
 */
export function GetList(params) {
	return request.post('/api/Delivery/ListDeliveryByPSP', params)
}

/**
 * 确认配送
 * @param params 
 * @return 
 */
export function ConfirmDelivery(params) {
	return request.post('/api/Delivery/ConfirmDeliveryByPSP', params)
}

/**
 * 完成配送
 * @param params 
 * @return 
 */
export function DeliveryFinished(params) {
	return request.post('/api/Delivery/DeliveryByPSPFinished', params)
}

/**
 * 统计报表数量、金额统计
 * @param params 
 * @return 
 */
export function GetOrderStat(params) {
	return request.post('/api/DashboardStat/GetOrderStat', params)
}

/**
 * 获取配送单详情
 * @param params 
 * @return 
 */
export function GetDeliveryDetail(params) {
	return request.get('/api/Delivery/GetDeliveryDetail', {params})
}

/**
 * 订单品类统计
 * @param params 
 * @return 
 */
export function GetOrderProductStat(params) {
	return request.post('/api/DashboardStat/GetOrderProductStat', params)
}

/**
 * 订单金额排名
 * @param params 
 * @return 
 */
export function GetOrderProductTopStat(params) {
	return request.post('/api/DashboardStat/GetOrderProductTopStat', params)
}

/**
 * 品类变化趋势统计
 * @param params 
 * @return 
 */
export function GetOrderProductTrendStat(params) {
	return request.post('/api/DashboardStat/GetOrderProductTrendStat', params)
}

/**
 * 印刷在产统计
 * @param params 
 * @return 
 */
export function GetPrintProductionStat(params) {
	return request.post('/api/DashboardStat/GetPrintProductionStat', params)
}

/**
 * 设备产量
 * @param params 
 * @return 
 */
export function GetThingsCapacityStat(params) {
	return request.post('/api/DashboardStat/GetThingsCapacityStat', params)
}

/**
 * 取消配送
 * @param params 
 * @return 
 */
export function CancelDeliveryByPSP(params) {
	return request.post('/api/Delivery/CancelDeliveryByPSP', params)
}

/**
 * 个人首页统计
 * @param params 
 * @return 
 */
export function MyStatInfo(params) {
	return request.post('/api/Profile/MyStatInfo', params)
}

/**
 * 我的收益列表
 * @param params 
 * @return 
 */
export function ListMyPerformances(params) {
	return request.post('/api/Profile/ListMyPerformances', params)
}

/**
 * 退出登录
 * @param params 
 * @return 
 */
export function LogOut(params) {
	return request.post('/api/UserMgr/LogOut', params)
}

/**
 * 获取绩效排名
 * @param params 
 * @return 
 */
export function GetPerformanceRank(params) {
	return request.post('/api/CalcPerformance/GetPerformanceRank', params)
}

/**
 * 主营业务收入统计
 * @param params 
 * @return 
 */
export function GetMainRevenueStat(params) {
	return request.post('/api/DashboardStat/GetMainRevenueStat', params)
}

/**
 * 订单数量统计
 * @param params 
 * @return 
 */
export function GetOrderCountStat(params) {
	return request.post('/api/DashboardStat/GetOrderCountStat', params)
}

/**
 * 我的工艺下设备绑定设置
 * @param params 
 * @return 
 */
export function ListMyProductionBindThings(params) {
	return request.post('/api/Profile/ListMyProductionBindThings', params)
}

/**
 * 工艺下绑定设备列表
 * @param params 
 * @return 
 */
export function ListTechnologyBindThings(params) {
	return request.post('/api/Profile/ListTechnologyBindThings', params)
}

/**
 * 保存绑定设备
 * @param params 
 * @return 
 */
export function SaveMyTechnologyBindThings(params) {
	return request.post('/api/Profile/SaveMyTechnologyBindThings', params)
}

/**
 * 加载配送列表(地址分组)
 * @param params 
 * @return 
 */
export function ListDeliveryByPSPByAddress(params) {
	return request.post('/api/Delivery/ListDeliveryByPSPByAddress', params)
}

/**
 * 加载配送列表(订单分组)
 * @param params 
 * @return 
 */
export function ListDeliveryByPSPBySaleOrder(params) {
	return request.post('/api/Delivery/ListDeliveryByPSPBySaleOrder', params)
}

/**
 * 获取订单配送单详情
 * @param params 
 * @return 
 */
export function GetDeliveryDetailBySaleOrder(params) {
	return request.get('/api/Delivery/GetDeliveryDetailBySaleOrder', {params})
}

/**
 * 批量开始配送
 * @param params 
 * @return 
 */
export function BatchConfirmDeliveryByPSP(params) {
	return request.post('/api/Delivery/BatchConfirmDeliveryByPSP', params)
}

/**
 * 批量完成配送
 * @param params 
 * @return 
 */
export function BatchDeliveryByPSPFinished(params) {
	return request.post('/api/Delivery/BatchDeliveryByPSPFinished', params)
}

/**
 * 批量撤销配送
 * @param params 
 * @return 
 */
export function BatchCancelDeliveryByPSP(params) {
	return request.post('/api/Delivery/BatchCancelDeliveryByPSP', params)
}
