<template>
	<view class="page-container">
		<uv-gap bg-color="#F3E6C8" height="16rpx"></uv-gap>
		<uv-form ref="form" :model="model" :rules="rules" :label-style="labelStyle" :border-bottom="false"
			label-width="220rpx">
			<view class="card-wrap">
				<text class="section-title">订单信息</text>
				<view class="padding-lr">
					<uv-form-item label="生产单号">
						<uv-input v-model="model.orderNo" border="none" readonly></uv-input>
					</uv-form-item>
					<uv-form-item label="标题"></uv-form-item>
					<uv-textarea v-model="model.title" border="none" auto-height
						:custom-style="textAreaStyle"></uv-textarea>
					<uv-form-item label="订单金额(元)">
						<uv-input v-model="model.amount"></uv-input>
					</uv-form-item>
					<uv-form-item label="返工金额(元)" required prop="returnAmount">
						<uv-input v-model="model.reWorkAmount"></uv-input>
					</uv-form-item>
					<uv-form-item label="数量" prop="count">
						<uv-input v-model="model.num"></uv-input>
					</uv-form-item>
				</view>
			</view>
			<uv-gap bg-color="#F3E6C8" height="16rpx"></uv-gap>
			<view class="card-wrap">
				<text class="section-title">相关人员</text>
				<view class="padding-lr">
					<uv-form-item label="责任人" required prop="mainPerson" borderBottom>
						<uv-input v-model="model.mainPerson" placeholder="请选择责任人" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"
							@click="openPicker('mainPerson')"></uv-input>
					</uv-form-item>
					<uv-form-item label="次要责任人" borderBottom>
						<uv-input v-model="model.secondaryPerson" placeholder="请选择次要责任人" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"
							@click="openPicker('secondaryPerson')"></uv-input>
					</uv-form-item>
					<uv-form-item label="带班" borderBottom>
						<uv-input v-model="model.shiftLeader" placeholder="请选择带班" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"
							@click="openPicker('shiftLeader')"></uv-input>
					</uv-form-item>
					<uv-form-item label="主管" borderBottom>
						<uv-input v-model="model.manager" placeholder="请选择主管" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"
							@click="openPicker('manager')"></uv-input>
					</uv-form-item>
					<uv-form-item label="责任问题原因" required prop="reason" borderBottom>
						<uv-checkbox-group v-model="model.reason" placement="column">
							<uv-checkbox :customStyle="{marginBottom: '16rpx'}" v-for="(item, index) in reasonList"
								:key="index" :label="item" :name="item"></uv-checkbox>
						</uv-checkbox-group>
					</uv-form-item>
					<uv-textarea v-if="model.reason.includes('其他问题')" v-model="model.otherReason" placeholder="请填写问题"
						border="none" auto-height :custom-style="textAreaStyle"></uv-textarea>
					<uv-form-item label="问题来源" borderBottom>
						<view class="flex-row">
							<text :class="['text-btn', 'flex-1', model.problemTypes === 1 ? 'active' : '']"
								@click="selectSource(1)">内部发现</text>
							<text :class="['text-btn', 'flex-1', model.problemTypes === 2 ? 'active' : '']"
								@click="selectSource(2)">外部发现</text>
						</view>
					</uv-form-item>
					<uv-form-item label="发现者" required prop="finder" borderBottom>
						<uv-input v-model="model.finder" placeholder="请选择发现者" border="none" readonly
							suffixIcon="arrow-down" suffixIconStyle="color: #909399"
							@click="openPicker('finder')"></uv-input>
					</uv-form-item>
					<uv-form-item label="备注">

					</uv-form-item>
					<uv-textarea v-model="model.remark" placeholder="请填写备注" border="none" count maxlength="500"
						:custom-style="textAreaStyle" :countStyle="{background: '#FFF8E7'}"></uv-textarea>
				</view>
			</view>
			<uv-gap bg-color="#F3E6C8" height="16rpx"></uv-gap>
			<view class="card-wrap">
				<text class="section-title">附件</text>
				<view class="padding-lr">
					<uv-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="10" style="margin-top: 15rpx;">
						<image src="/static/images/logistics/Group 427319118.svg" class="upload-image"></image>
					</uv-upload>
				</view>
			</view>
		</uv-form>
		<uv-picker ref="picker" :columns="memberList" keyName="name" @confirm="confirmWorker"></uv-picker>
		<view class="footer-wrap">
			<view class="btn-submit" @click="submit"><text>提交</text></view>
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
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		CreateReWordBill,
		GetIssueCharger,
		GetSourceBillDetail
	} from '../../apis/member';
	import {baseURL} from "@/common/config";

	const form = ref(null)
	const picker = ref(null)
	const pickKey = ref('')
	const memberList = ref([])
	const reasonList = ref(["代客开单问题", "机房打印问题", "后工制作问题", "运输损坏问题", "其他问题"])
	const fileList = ref([])
	const model = reactive({
		orderNo: '',
		title: '',
		amount: 0,
		reWorkAmount: 0,
		num: 0,
		mainPerson: '',
		secondaryPerson: '',
		shiftLeader: '',
		manager: '',
		reason: [],
		finder: '',
		remark: '',
		otherReason: '',
		responsibleId: '',
		problemTypes: 1,
		responsibleCrewLeaderId: '',
		responsibleExecutiveStaffId: '',
		responsibleSubordinationId: '',
		discovererId: ''
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
			trigger: ['blur']
		}],
		finder: [{
			required: true,
			message: '此为必填字段',
			trigger: ['blur', 'change']
		}]
	})

	const labelStyle = computed(() => {
		return {
			color: '#6B6258'
		}
	})

	const textAreaStyle = computed(() => {
		return {
			background: '#FFF8E7',
			borderRadius: '0',
			padding: '32rpx',
			border: '2rpx solid rgba(28, 25, 23, 0.38)'
		}
	})

	const buttomStyle = computed(() => {
		return {
			height: '76rpx',
			width: '156rpx',
			color: '#fff',
			background: '#B42318',
			borderRadius: '0'
		}
	})

	onLoad((options) => {
		GetSourceBillDetail({
			scanCode: options.scanCode
		}).then(res => {
			const {
				billNo,
				amount,
				num,
				reWorkAmount,
				title
			} = res.data || {}

			model.orderNo = billNo
			model.title = title
			model.amount = amount
			model.reWorkAmount = reWorkAmount
			model.num = num
		})
		GetIssueCharger({
			keyWords: ''
		}).then(res => {
			memberList.value = [res.data] || []
		})
	})

	const openPicker = (key) => {
		picker.value.open()
		pickKey.value = key
	}
	const confirmWorker = (e) => {
		const id = {
			mainPerson: 'responsibleId',
			shiftLeader: 'responsibleCrewLeaderId',
			manager: 'responsibleExecutiveStaffId',
			secondaryPerson: 'responsibleSubordinationId',
			finder: 'discovererId'
		}[pickKey.value]
		
		model[pickKey.value] = e.value[0].name
		model[id] = e.value[0].employeeId
	}
	const selectSource = (key) => {
		model.problemTypes = key
	}
	const afterRead = async(event) => {
		const lists = event.file
		const fileListLen = fileList.value.length
	
		lists.forEach((item) => {
			fileList.value.push({
				...item,
				status: 'uploading',
				message: '上传中'
			})
		})
		lists.forEach(async (item, index) => {
			const result = await uploadFilePromise(item.url)
			fileList.value.splice(fileListLen + index, 1, {
				...item,
				...result.data[0],
				status: 'success',
				message: '',
			})
		})
	}
	const uploadFilePromise = (url) => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: baseURL + 'api/FileUpload/UploadFile', // 开发者服务器的上传接口地址
				filePath: url, // 要上传的文件资源路径
				name: 'file', // 必填，后台用来解析的文件名
				header: {
					Authorization: `Bearer ${uni.getStorageSync('token')}`,
				},
				success: function(res) {
					console.log('上传成功', JSON.parse(res.data));
					resolve(JSON.parse(res.data))
				},
			});
		})
	
	}
	const deletePic = (event) => {
		fileList.value.splice(event.index, 1)
	}
	const submit = () => {
		CreateReWordBill({
			title: model.title,
			remark: model.remark,
			price: model.amount,
			num: model.num,
			type: 1,
			entityNo: model.orderNo,
			srcOrderItemId: '',
			srcSaleOrderId: '',
			responsibleId: model.responsibleId,
			responsibleProblem: model.reason.join(',') + ',' + model.otherReason,
			problemTypes: model.problemTypes,
			amount: model.reWorkAmount,
			accountingPeriodId: '',
			responsibleCrewLeaderId: model.responsibleCrewLeaderId,
			responsibleExecutiveStaffId: model.responsibleExecutiveStaffId,
			reworkRatio: {
				1: '50%',
				2: '70%'
			}[model.problemTypes],
			filePath: fileList.value.map(item => item.filePath).join(','),
			responsibleSubordinationId: model.responsibleSubordinationId,
			discovererId: model.discovererId
		}).then(res => {
			uni.$uv.toast('提交成功')
			uni.navigateBack()
		})
	}
</script>

<style>
	page {
		background-color: var(--ticket-paper);
	}
</style>
<style lang="scss" scoped>
	.page-container {
		padding-bottom: calc(128rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(128rpx + env(safe-area-inset-bottom));
	}

	.card-wrap {
		@include flex(column);
		line-height: 80rpx;
		background-color: var(--ticket-face);
		padding: 30rpx 0;
		border: 2rpx solid var(--ticket-edge);

		.text-area {
			background-color: var(--ticket-paper);
			padding: 32rpx;
			border-radius: 0;
			font-size: 28rpx;
		}
	}

	.text-btn {
		background: var(--ticket-paper);
		border-radius: 0;
		height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		text-align: center;
		padding: 17rpx 55rpx;
		border: 2rpx solid var(--ticket-edge);

		&.active {
			color: var(--stamp-red);
			background-color: var(--ticket-face);
			border-color: var(--stamp-red);
		}
	}

	.text-btn+.text-btn {
		margin-left: 24rpx;
	}

	.section-title {
		position: relative;
		padding-left: 0.7em;
		font-weight: bold;
		font-size: 36rpx;
		color: var(--ink-black);
		line-height: 53rpx;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			height: 1em;
			width: 0.25em;
			border-radius: 0;
			background-color: #B42318;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	
	.upload-image {
		width: 152rpx;
		height: 152rpx;
	}
	
	.footer-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 900;
		padding: 16rpx 30rpx;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
		background-color: var(--ticket-face);
		border-top: 2rpx solid var(--ink-black);
	}

	.btn-submit {
		height: 96rpx;
		line-height: 96rpx;
		text-align: center;
		background: #B42318;
		color: #fff;
		border-radius: 0;
	}
</style>