import type {
	HttpResponse,
	HttpTask,
	HttpError
} from "@/uni_modules/uv-ui-tools/libs/luch-request";
import config from "@/common/config";
import Utils from "@/utils/index";
import { StatusCode } from "@/enums";


/**
 * 基本使用方式
 * request.get(url, {params});
 * request.post(url, data);
 * request.upload(url);
 * 详细: https://www.uviewui.com/js/http.html;
 */

const http = uni.$uv.http;
const { baseURL } = config;
const timeout = 30000;

function handleStatusCode(res : HttpResponse<any, HttpTask> | HttpError<any, HttpTask>) {
	const {
		statusCode,
		data,
	} = res || {};
	const { code, message, ...resData } = data
	switch (statusCode) {
		case StatusCode.SUCCESS:
			if (code === 1001) {
				Utils.showToast('message');
				Utils.removeAllStorage()
				Utils.navigateTo('/pages/login/login')
			} else {
				return data;
			}
		case StatusCode.LOGIN_ERROR:
			Utils.showToast('登录失效');
			break;
		case StatusCode.SYSTEM_ERROR:
			Utils.showToast('系统错误');
			break;
		default:
			if (message) {
				Utils.showToast(message);
			} else {
				Utils.showToast('服务接口请求异常');
			}
			break;
	}
	return Promise.reject(data);
}

http.setConfig((config) => {
	config.baseURL = baseURL;
	config.timeout = timeout;
	return config;
});
http.interceptors.request.use(
	(config) => {
		const { header } = config;
		config.header = {
			...header,
			Authorization: `Bearer ${uni.getStorageSync('token')}`,
		};
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
http.interceptors.response.use(
	(response) => {
		return handleStatusCode(response);
	},
	(error) => {
		return handleStatusCode(error);
	}
);

export default http;