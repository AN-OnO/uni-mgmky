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
	return request.post('/api/Production/ListDeliveryByPSP', params)
}

/**
 * 确认配送
 * @param params 
 * @return 
 */
export function ConfirmDelivery(params) {
	return request.post('/api/Production/ConfirmDeliveryByPSP', params)
}

/**
 * 完成配送
 * @param params 
 * @return 
 */
export function DeliveryFinished(params) {
	return request.post('/api/Production/DeliveryByPSPFinished', params)
}

/**
 * 统计报表数量、金额统计
 * @param params 
 * @return 
 */
export function GetOrderStat(params) {
	return request.post('/api/DashboardStat/GetOrderStat', params)
}