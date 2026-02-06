<template>
	<view style="padding: 30rpx;">
		<view class="upload-title">{{uploadType == 4 ? '请上传寄件信息' : '请上传配送信息'}}</view>
		<uv-form>
			<uv-form-item v-if="uploadType == 4" label="快递单号" labelPosition='top' labelWidth="200rpx"
				leftIcon='/static/images/logistics/1.svg'>
				<uv-input placeholder="请输入快递单号" v-model="formValue.number" style="margin-top: 15rpx;">
					<template v-slot:suffix>
						<uv-icon name="/static/images/logistics/scan.svg" size="32" @click="onScanTap"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item v-if="uploadType == 4" label="快递公司" labelPosition='top' labelWidth="200rpx"
				leftIcon='/static/images/logistics/2.svg'>
				<uv-input placeholder="请选择快递公司" v-model="formValue.company" style="margin-top: 15rpx;" />
			</uv-form-item>
			<uv-form-item label="请上传快递图片(至少一张)" labelPosition='top' labelWidth="500rpx"
				:leftIcon="uploadType == 4? '/static/images/logistics/3.svg' : '/static/images/logistics/1.svg'">
				<uv-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="10" style="margin-top: 15rpx;">
					<image src="/static/images/logistics/Group 427319118.svg" class="upload-image"></image>
				</uv-upload>
			</uv-form-item>
			<uv-form-item v-if="uploadType !== 4" label="备注(选填)" labelPosition='top' labelWidth="500rpx"
				leftIcon='/static/images/logistics/2.svg'>
				<uv-textarea v-model="formValue.remark" placeholder="备注内容" style="margin-top: 15rpx;"></uv-textarea>
			</uv-form-item>
			<button class="upload-button" @click="submit"><text class="text-upload">确认提交</text></button>
			<button plain style="border-color:#FFFFFF" @click="closeModal"><text class="text-cancel">取消</text></button>
		</uv-form>
	</view>
</template>

<script>
	import {
		DeliveryFinished
	} from "../../apis/member";
	import {baseURL} from "@/common/config";
	export default {
		props: {
			closeModal: {
				type: Function,
				default: () => {}
			},
			uploadType: {
				type: Number,
				default: 3
			},
			orderItemNo: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				fileList: [],
				formValue: {
					number: '',
					company: '',
					remark: ''
				},
			}
		},
		methods: {
			async submit() {
				await DeliveryFinished({
					orderItemNo: this.orderItemNo,
					attachmentInfos: this.fileList,
					remark: this.formValue.remark,
					express_no: this.formValue.number,
					express_company: this.formValue.company
				})
				this.closeModal('reFresh')
			},
			onScanTap() {
				// 调用小程序的扫码 API
				uni.scanCode({
					success: (res) => {
						console.log('扫码结果：', res);
						this.formValue.number = res.result
					}
				});
			},
			async afterRead(event) {
				const lists = event.file
				const fileListLen = this.fileList.length

				lists.forEach((item) => {
					this.fileList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				lists.forEach(async (item, index) => {
					try {
						const result = await this.uploadFilePromise(item.url)
						this.fileList.splice(fileListLen + index, 1, {
							...item,
							...result.data[0],
							status: 'success',
							message: '',
						})
					} catch (err) {
						this.fileList.splice(fileListLen + index, 1, {
							...item,
							status: 'failed',
							message: '上传失败',
						})
					}
				})
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: baseURL + '/api/FileUpload/UploadFile', // 开发者服务器的上传接口地址
						filePath: url, // 要上传的文件资源路径
						name: 'file', // 必填，后台用来解析的文件名
						header: {
							Authorization: `Bearer ${uni.getStorageSync('token')}`,
						},
						success: function(res) {
							console.log('上传成功', JSON.parse(res.data));
							resolve(JSON.parse(res.data))
						},
						fail: function(err) {
							console.log('上传失败', err);
							reject(err)
						},
					});
				})

			},
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
		},
	}
</script>

<style scoped>
	.upload-title {
		font-weight: 500;
		font-size: 46rpx;
		color: #333333;
		line-height: 69rpx;
		text-align: center;
	}

	.upload-image {
		width: 152rpx;
		height: 152rpx;
	}

	.upload-button {
		height: 92rpx;
		background: #2FB7DF;
		border-radius: 31rpx;
		margin-top: 61rpx;
	}

	.text-upload {
		font-weight: 500;
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 53rpx;
	}

	.text-cancel {
		font-weight: 500;
		font-size: 31rpx;
		color: #999999;
		line-height: 53rpx;
	}
</style>