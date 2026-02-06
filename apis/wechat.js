import request from "../utils/request"

/**
 * 扫码查单 
 */
export function ScanRedirect(params) {
	return request.post('/api/Wechat/ScanRedirect',params);
}
