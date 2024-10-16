<template>
	<view style="padding: 32rpx;">
		<view class="upload-title">{{type === '物流' ? '请上传寄件信息' : '请上传配送信息'}}</view>
		<uv-form>
			<uv-form-item  v-if="type === '物流'" label="快递单号" labelPosition='top' labelWidth="200rpx">
				<uv-input placeholder="请输入快递单号" suffix-icon="scan" style="margin-top: 15rpx;" />
			</uv-form-item>
			<uv-form-item v-if="type === '物流'" label="快递公司" labelPosition='top' labelWidth="200rpx">
				<uv-input placeholder="请选择快递公司" style="margin-top: 15rpx;" />
			</uv-form-item>
			<uv-form-item label="数量(件)" labelPosition='top' labelWidth="200rpx">
				<uv-number-box   style="margin-top: 15rpx;" bgColor="#ffffff"
					iconStyle='background-color:#F5F6F7;width: 60rpx;height: 60rpx;justify-content: center'></uv-number-box>
			</uv-form-item>
			<uv-form-item label="重量(kg)" labelPosition='top' labelWidth="200rpx">
				<uv-number-box   style="margin-top: 15rpx;" bgColor="#ffffff"
					iconStyle='background-color:#F5F6F7;width: 60rpx;height: 60rpx;justify-content: center'></uv-number-box>
			</uv-form-item>
			<uv-form-item label="请上传快递图片(至少一张)" labelPosition='top' labelWidth="500rpx">
				<uv-upload  name="1" multiple :maxCount="10" style="margin-top: 15rpx;">
					<image src="../../static/images/logistics/Group 427319118.svg" class="image"></image>
				</uv-upload>
			</uv-form-item>
			<uv-form-item v-if="type !== '物流'" label="备注(选填)" labelPosition='top' labelWidth="500rpx">
				<uv-textarea  placeholder="备注内容" style="margin-top: 15rpx;"></uv-textarea>
			</uv-form-item>
			<button class="upload-button" @click="submit"><text class="text-upload">确认提交</text></button>
			<button plain style="border-color:#FFFFFF" @click="reset"><text class="text-cancel">取消</text></button>
		</uv-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '配送'
			}
		},
		methods: {
			submit() {
				
			},
			reset() {
				
			}
		}
	}
</script>

<style>
	.upload-title {
		font-weight: 500;
		font-size: 46rpx;
		color: #333333;
		line-height: 69rpx;
		text-align: center;
	}

	.image {
		width: 152rpx;
		height: 152rpx;
	}

	.upload-button {
		width: 628rpx;
		height: 92rpx;
		background: #333333;
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