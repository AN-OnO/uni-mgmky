import { hex_md5 } from '@/utils/md5.js'
import { $uv } from '@/uni_modules/uv-ui-tools/index.js'
import type { ModalParams, CallbackFunction } from "types/utils";
// 工具类
class Utils {
	static showToast = (message : string) => {
		uni.showToast({
			icon: 'none',
			title: message,
			duration: 1500
		});
	}
	static showModal = ({
		title = '',
		content = '',
		confirm,
		cancel
	} : ModalParams) => {
		uni.showModal({
			title,
			content,
			success: res => {
				if (res.confirm) {
					confirm?.();
				} else if (res.cancel) {
					cancel?.();
				}
			}
		});
	}
	static switchTab = (url : string, success ?: CallbackFunction) => {
		uni.switchTab({
			url,
			success
		});
	}
	static navigateTo = (url : string, success ?: CallbackFunction) => {
		uni.navigateTo({
			url,
			success
		});
	}
	static redirectTo = (url : string, success ?: CallbackFunction) => {
		uni.redirectTo({
			url,
			success
		});
	}
	static navigateBack = (delta = 1, url = '/pages/tabbar/home') => {
		const pages = getCurrentPages();
		if (pages.length > 1) {
			uni.navigateBack({
				delta
			});
		} else {
			uni.switchTab({
				url
			})
		}
	}
	static setStorage(key : string, value : unknown) {
		uni.setStorageSync(key, value);
	}
	static getStorage<T>(key : string) : T {
		return uni.getStorageSync(key)
	}
	static removeStorage(key : string) {
		uni.removeStorageSync(key);
	}
	static removeAllStorage() {
		uni.clearStorageSync()
	}

	static md5(value : string) : string {
		return hex_md5(value)
	}
	static getUuid() : string {
		return $uv.guid()
	}
	static getSessionId() : string {
		let sessionId = uni.getStorageSync('sessionId')
		if (!sessionId) {
			sessionId = $uv.guid()
			uni.setStorageSync('sessionId', sessionId)
		}
		return sessionId
	}
}
export default Utils