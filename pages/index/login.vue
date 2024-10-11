<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<text class="title">{{app}}</text>

		<view class="login-form">
			<uv-form labelPosition="left" :model="loginForm" :rules="loginFormRules" ref="form">
				<uv-form-item prop="account" :custom-style="formItemStyle">
					<uv-input v-model="loginForm.account" placeholder="请输入账号" border="none">
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="password" :custom-style="formItemStyle">
					<uv-input v-model="loginForm.password" placeholder="请输入密码" border="none">
					</uv-input>
				</uv-form-item>
			</uv-form>
			<uv-button type="default" text="登录" size="large" :custom-style="submitStyle"></uv-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	const app = '多普智能工厂'
	const loginForm = {
		account: '',
		password: ''
	}
	const loginFormRules = {}

	const formItemStyle = computed(() => {
		return {
			padding: '30rpx',
			background: '#EFF1F3',
			borderRadius: '30rpx',
			marginBottom: '45rpx'
		}
	})

	const submitStyle = computed(() => {
		return {
			height: '92rpx',
			width: '658rpx',
			background: '#333333',
			color: '#fff',
			marginTop: '120rpx',
			borderRadius: '100rpx'
		}
	})
</script>

<style>
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
		margin-top: 250rpx;
	}
</style>