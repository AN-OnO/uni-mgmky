<template>
	<view class="content">
		<uv-status-bar></uv-status-bar>
		<view class="ticket">
			<image class="app_logo" src="/static/liqiuyuan-logo.png" mode="widthFix"></image>
			<text class="title">{{appName}}</text>
			<view class="ticket-perf"></view>
			<view class="login-form">
				<uv-form ref="form" labelWidth="30rpx" :model="loginForm" :rules="loginFormRules">
					<uv-form-item prop="userName" :custom-style="formItemStyle">
						<uv-input v-model="loginForm.userName" placeholder="请输入账号" fontSize="32rpx" border="none">
						</uv-input>
					</uv-form-item>
					<uv-form-item prop="password" :custom-style="formItemStyle">
						<uv-input v-model="loginForm.password" placeholder="请输入密码" fontSize="32rpx"
							border="none" :password="!showPassword">
							<template v-slot:suffix>
								<image :src="showPassword ? '/static/images/tabbar/unlocked.svg' : '/static/images/tabbar/locked.svg'"
									style="max-width: 45.8rpx;max-height: 45.8rpx;" @click="handlePassword"></image>
							</template>
						</uv-input>
					</uv-form-item>
				</uv-form>
				<uv-button type="default" text="登录" size="large" :custom-style="loginBtnStyle"
					:custom-text-style="{fontSize:'36rpx'}" @click="handleLogin"></uv-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue';
	import {
		Login
	} from '@/apis/member.js';
	import {
		useUserStore
	} from '@/store/user';

	const userStore = useUserStore()
	const appName = '' // 应用名称
	const form = ref(null)
	const showPassword = ref(false)
	
	const handlePassword = () => {
		if (showPassword.value) {
			showPassword.value = false
		} else {
			showPassword.value = true
		}
	}
	// 表单实体
	const loginForm = reactive({
		userName: '',
		password: ''
	})
	// 表单验证规则
	const loginFormRules = reactive({
		'userName': [{
			type: 'string',
			required: true,
			message: '账号不能为空',
			trigger: ['blur']
		}],
		'password': [{
			type: 'string',
			required: true,
			message: '密码不能为空',
			trigger: ['blur']
		}, {
			pattern: /^[0-9a-zA-Z]*$/g,
			transform(value) {
				return String(value);
			},
			message: '只能包含字母或数字'
		}]
	})
	// 表单子项自定义样式
	const formItemStyle = computed(() => {
		return {
			padding: '24rpx',
			background: '#FFF8E7',
			borderRadius: '0',
			margin: '16rpx 0',
			border: '2rpx solid rgba(28, 25, 23, 0.38)'
		}
	})
	const loginBtnStyle = computed(() => {
		return {
			background: '#B42318',
			color: '#fff',
			marginTop: '48rpx',
			borderRadius: '0'
		}
	})
	// 登录方法
	const handleLogin = () => {
		form.value.validate()
			.then(() => {
				Login({
					userName: loginForm.userName,
					password: uni.$Utils.md5(loginForm.password)
				}).then(res => {
					if (res.code === 0) {
						userStore.setToken(res.data.accessToken)
						userStore.setUserData(res.data.logonUserInfo)
						// uni.$Utils.switchTab('/pages/tabbar/home')
						uni.$Utils.redirectTo('/pages/tabbar/index')
						uni.$Utils.setStorage('tabbar', 'home')
					} else {
						uni.$Utils.showToast(res.message)
					}
				}).catch(e => {
					console.error('login fail:', e)
				})
			})
			.catch(error => {
				const msg = error[0].message
				uni.$uv.toast(msg)
			})
	}
</script>

<style lang="scss" scoped>
	.content {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: 48rpx 40rpx 80rpx;
		box-sizing: border-box;
		background: var(--ticket-paper);
	}

	.ticket {
		margin-top: 48rpx;
	}

	.app_logo {
		width: 220rpx;
		margin: 32rpx 0 8rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--ink-black);
	}

	.login-form {
		width: 100%;
	}
</style>