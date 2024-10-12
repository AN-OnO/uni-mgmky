import request from "@/utils/request";

/**
 * 用户登录
 * @param params 
 * @return 
 */
export function AccountLogin(params) {
	return request.post('/api/Member/Login', params);
}