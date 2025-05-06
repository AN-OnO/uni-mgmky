<template>
	<view class="page-container">
		<uv-gap bg-color="#F0F1F5" height="8px"></uv-gap>
		<uv-form ref="form" :model="model" :rules="rules" :label-style="labelStyle" :border-bottom="false"
			label-width="220rpx">
			<view class="card-wrap">
				<text class="section-title">订单信息</text>
				<view class="padding-lr">
					<uv-form-item label="生产单号">
						<uv-input v-model="model.orderNo" border="none" readonly></uv-input>
					</uv-form-item>
					<uv-form-item label="标题"></uv-form-item>
					<!-- <view class="text-area">{{model.title}}</view> -->
					<uv-textarea v-model="model.title" border="none" auto-height
						:custom-style="textAreaStyle"></uv-textarea>
					<uv-form-item label="订单金额(元)">
						<uv-input v-model="model.orderAmount"></uv-input>
					</uv-form-item>
					<uv-form-item label="返工金额(元)" required prop="returnAmount">
						<uv-input v-model="model.returnAmount"></uv-input>
					</uv-form-item>
					<uv-form-item label="数量" prop="count">
						<uv-input v-model="model.count"></uv-input>
					</uv-form-item>
				</view>
			</view>
			<uv-gap bg-color="#F0F1F5" height="8px"></uv-gap>
			<view class="card-wrap">
				<text class="section-title">相关人员</text>
				<view class="padding-lr">
					<uv-form-item label="责任人" required prop="mainPerson" borderBottom>
						<uv-input v-model="model.mainPerson" border="none" readonly suffixIcon="arrow-down"
							suffixIconStyle="color: #909399"></uv-input>
					</uv-form-item>
					<uv-form-item label="次要责任人" borderBottom>
						<uv-input v-model="model.secondaryPerson" placeholder="请选择次要责任人" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"></uv-input>
					</uv-form-item>
					<uv-form-item label="带班" borderBottom>
						<uv-input v-model="model.shiftLeader" placeholder="请选择带班" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"></uv-input>
					</uv-form-item>
					<uv-form-item label="主管" borderBottom>
						<uv-input v-model="model.manager" placeholder="请选择主管" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"></uv-input>
					</uv-form-item>
					<uv-form-item label="责任问题原因" required prop="reason" borderBottom>
						<uv-input v-model="model.reason" placeholder="请选择责任问题原因" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"></uv-input>
					</uv-form-item>
					<uv-form-item label="问题来源" borderBottom>
						<view class="flex-row">
							<text class="text-btn flex-1 active">内部发现</text>
							<text class="text-btn flex-1">外部发现</text>
						</view>
					</uv-form-item>
					<uv-form-item label="发现者" required prop="finder" borderBottom>
						<uv-input v-model="model.finder" placeholder="请选择发现者" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"></uv-input>
					</uv-form-item>
					<uv-form-item label="备注">

					</uv-form-item>
					<uv-textarea v-model="model.remark" placeholder="请填写备注" border="none" count maxlength="500"
						:custom-style="textAreaStyle" :countStyle="{background: '#F7F8FA'}"></uv-textarea>
				</view>
			</view>
			<uv-gap bg-color="#F0F1F5" height="8px"></uv-gap>
			<view class="card-wrap">
				<text class="section-title">附件</text>
				<view></view>
			</view>
		</uv-form>

		<view class="footer-wrap">
			<view class="btn-submit"><text>提交</text></view>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		reactive
	} from 'vue';
	// import {
	// 	onReachBottom
	// } from '@dcloudio/uni-app'

	const form = ref(null)
	const model = reactive({
		orderNo: 'T002750',
		title: '激光画册【激光画册】210mmx297mm-封面:需要印封面200g铜版纸-单面彩色-【备注】:-【优先级】:加急-封面亮膜-书脊方式:延伸封面-内页:80g太阳双胶原白-双面黑白--竖版左翻-无线胶装-需要装订成册-单款1本-每本内页28页',
		orderAmount: 89.02,
		returnAmount: 44.51,
		count: 500,
		mainPerson: '冯启彬',
		secondaryPerson: '',
		shiftLeader: '',
		manager: '',
		reason: '',
		source: '',
		finder: '',
		remark: '',
		files: []

	})
	const rules = reactive({
		returnAmount: [{
			required: true,
			message: '此为必填字段',
			trigger: ['blur', 'change']
		}],
		mainPerson: [{
			required: true,
			message: '此为必填字段',
			trigger: ['blur', 'change']
		}],
		reason: [{
			required: true,
			message: '此为必填字段',
			trigger: ['blur', 'change']
		}],
		finder: [{
			required: true,
			message: '此为必填字段',
			trigger: ['blur', 'change']
		}]
	})

	const labelStyle = computed(() => {
		return {
			color: '#888'
		}
	})

	const textAreaStyle = computed(() => {
		return {
			background: '#F7F8FA',
			borderRadius: '8px',
			padding: '16px'
		}
	})

	const buttomStyle = computed(() => {
		return {
			height: '76rpx',
			width: '156rpx',
			color: '#fff',
			background: '#469DCD',
			borderRadius: '15rpx'
		}
	})
</script>

<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.page-container {
		padding-bottom: 64px;
	}

	.card-wrap {
		@include flex(column);
		line-height: 80rpx;
		background-color: #fff;
		padding: 30rpx 0;

		.text-area {
			background-color: #F7F8FA;
			padding: 16px;
			// margin-bottom: 16px;
			border-radius: 8px;
			font-size: 28rpx;
		}
	}

	.text-btn {
		background: #F2F3F5;
		border-radius: 8px;
		height: 40px;
		font-size: 14px;
		font-weight: bold;
		text-align: center;

		&.active {
			color: #3862CF;
			background-color: #E6F1FF;
		}
	}

	.text-btn+.text-btn {
		margin-left: 12px;
	}

	.section-title {
		position: relative;
		padding-left: 0.7em;
		font-weight: bold;
		font-size: 36rpx;
		color: #333333;
		line-height: 53rpx;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			height: 1em;
			width: 0.25em;
			border-radius: 10px;
			background-color: #7BC7FC;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.footer-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 900;
		padding: 8px 30rpx;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
		background-color: #fff;
	}

	.btn-submit {
		height: 48px;
		line-height: 48px;
		text-align: center;
		background: #469DCD;
		color: #fff;
		border-radius: 8px;
	}
</style>