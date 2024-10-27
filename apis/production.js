import request from "@/utils/request";

/**
 * 我的工艺及待完成工单数量
 * @param params 
 * @return 
 */
export function ListMyProductionTechnology(params) {
	return request.post('/api/Production/ListMyProductionTechnology', params);
}

/**
 * 今日完成件数和今日收益
 * @param params 
 * @return 
 */
export function MyCompletedStatForToday(params) {
	return request.post('/api/Production/MyCompletedStatForToday', params);
}

/**
 * 分页加载工艺下待处理的单子的列表
 * @param params 
 * @return 
 */
export function ListTechnologyOrderItems(params) {
	return request.post('/api/Production/ListTechnologyOrderItems', params);
}

/**
 * 获取工艺下生产单详情
 * @param params 
 * @return 
 */
export function GetTechnologyOrderItemDetail(params) {
	return request.post('/api/Production/GetTechnologyOrderItemDetail', params);
}

/**
 * 扫描处理
 * @param params 
 * @return 
 */
export function ScanResult(params) {
	return request.post('/api/Production/ScanResult', params);
}