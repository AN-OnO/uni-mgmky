import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Utils from '@/utils/index';

export const useUserStore = defineStore('user', () => {
	const token = ref<string>(Utils.getStorage('token'));
	const userData = ref<any>(Utils.getStorage('user'));

	const isLogin = computed(() => !!token.value);

	function setToken(value : string) {
		token.value = value;
		Utils.setStorage('token', value);
	}

	function setUserData(value : any) {
		userData.value = value;
		Utils.setStorage('user', value);
	}

	return {
		token,
		isLogin,
		userData,
		setToken,
		setUserData
	};
});