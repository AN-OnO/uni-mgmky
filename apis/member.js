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

export function ClockIn() {
	return request.post('/api/Attendance/ClockIn');
}