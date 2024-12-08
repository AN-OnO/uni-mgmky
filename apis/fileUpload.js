import request from "@/utils/request";

/**
 * 上传附件
 * @param params 
 * @return 
 */
export function UploadFile(params) {
	return request.post('/api/FileUpload/UploadFile', params);
}