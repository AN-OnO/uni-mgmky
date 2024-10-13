<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<text class="title">{{appName}}</text>

		<view class="login-form">
			<uv-form ref="form" labelWidth="30rpx" :model="loginForm" :rules="loginFormRules">
				<uv-form-item prop="userName" :custom-style="formItemStyle">
					<uv-input v-model="loginForm.userName" placeholder="请输入账号" border="none">
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="password" :custom-style="formItemStyle">
					<uv-input type="password" v-model="loginForm.password" placeholder="请输入密码" border="none">
					</uv-input>
				</uv-form-item>
			</uv-form>
			<uv-button type="default" text="登录" size="large" :custom-style="loginBtnStyle"
				@click="handleLogin"></uv-button>
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
	const appName = '多普智能工厂' // 应用名称
	const form = ref(null)
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
			padding: '30rpx',
			background: '#EFF1F3',
			borderRadius: '30rpx',
			margin: '30rpx 0 10rpx 0'
		}
	})
	// 登录按钮自定义样式
	const loginBtnStyle = computed(() => {
		return {
			width: 'calc(100vw - 100rpx)',
			background: '#333333',
			color: '#fff',
			marginTop: '160rpx',
			borderRadius: '100rpx'
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
						uni.$Utils.switchTab('/pages/tabbar/home')
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 88rpx;
		width: 254rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 30rpx;
		color: #808080;
	}

	.login-form {
		margin-top: 200rpx;
	}
</style>