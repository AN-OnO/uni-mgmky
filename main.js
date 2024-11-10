import App from './App'
import '@/common/intercept'
import Utils from '@/utils/index'
import uvUI from '@/uni_modules/uv-ui-tools'
import {
	imageURL
} from "@/common/config";
uni.$Utils = Utils

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.prototype.$IMG_URL = imageURL;
Vue.use(uvUI)
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import * as Pinia from 'pinia'

export function createApp() {
	const app = createSSRApp(App)
	app.use(Pinia.createPinia())
	app.use(uvUI);
	app.config.globalProperties.$IMG_URL = imageURL
	return {
		app,
		Pinia
	}
}
// #endif