<template>
	<view class="container-background" style="height: 100%;">
		<view class="container">
			<view>
			<view style="background: #333333;border-radius: 15rpx;">
				<view class='flex-center'>
					<image class="image" src="../../static/images/logistics/待配送.svg" mode=""></image>
					<text
						style="font-weight: 500;font-size: 46rpx;color: rgba(255,255,255,0.9);line-height: 69rpx;">订单待取送</text>
				</view>
				<view class='flex-center'>
					<image class="image" src="../../static/images/logistics/infoLocal (已定位).svg" mode=""></image>
					<text
						style="font-weight: 500;font-size: 31rpx;color: rgba(255,255,255,0.9);line-height: 46rpx;">汝河路-永昌广告印务
						13923274241</text>
				</view>
				<div style="font-size: 27rpx;color: rgba(255,255,255,0.6);line-height: 38rpx;margin-left: 85.8rpx;">
					河南省郑州市中原区伏牛南路209-1金帝大厦南门美</div>
			</view>
			<view style="background: #FFFFFF; margin-top: 15rpx; padding: 30rpx;">
				<view style="display: flex;">
					<uv-image src="" width="152.67rpx" height="152.67rpx"></uv-image>
					<view style="padding-left: 30rpx;">
						<view class="line-clamp-3">特价喷墨画册260x185mm-广告制作尺寸1.2进口机特价喷墨画册260x185mm-广告制作尺寸1.2进口机1354534
						</view>
						<text>X4</text>
					</view>
				</view>
				<view style="margin: 30rpx 0; border: 2rpx solid #D9D9D9;"></view>
				<view>
					<text style="font-weight: 500;font-size: 34rpx;color: #333333;line-height: 53rpx;">订单信息</text>
					<uv-form>
						<uv-form-item class="align-right font-style" label="订单编号:" labelWidth='250rpx'>
							<text>240820000041478</text>
							<button class="button-copy"><text class="text-copy">复制</text></button>
						</uv-form-item>
						<uv-form-item class="font-style" label="订购内容:" labelWidth='250rpx'>
							<text>特价喷墨画册260x185mm-广告制作尺寸1.2进口机特价喷墨画册260x185mm-广告制作尺寸1.2进口机制作尺寸</text>
						</uv-form-item>
						<uv-form-item class="align-right font-style" label="订购数量:" labelWidth='250rpx'>
							<text>4</text>
						</uv-form-item>
						<uv-form-item class="align-right font-style" label="下单时间:" labelWidth='250rpx'>
							<text>2024-08-02 12:49:40</text>
						</uv-form-item>
						<uv-form-item class="align-right font-style" label="邮寄方式:" labelWidth='250rpx'>
							<text>寄付</text>
						</uv-form-item>
						<uv-form-item class="align-right font-style" label="下单备注:" labelWidth='250rpx'>
							<text>-</text>
						</uv-form-item>
						<uv-form-item v-if="!buttonText" class="align-right font-style" label="完成时间:"
							labelWidth='250rpx'>
							<text>2024-08-02 12:49:40</text>
						</uv-form-item>
						<uv-form-item v-if="!buttonText" class="align-right font-style" label="寄件单号:"
							labelWidth='250rpx'>
							<text>SF240820000041478</text>
						</uv-form-item>
						<uv-form-item v-if="!buttonText" class="align-right font-style" label="寄件图片:"
							labelWidth='250rpx' labelPosition='top'>
							<uv-image src="" width="145.04rpx" height="145.04rpx" style="margin: 8rpx;"></uv-image>
							<uv-image src="" width="145.04rpx" height="145.04rpx" style="margin: 8rpx;"></uv-image>
							<uv-image src="" width="145.04rpx" height="145.04rpx" style="margin: 8rpx;"></uv-image>
						</uv-form-item>
					</uv-form>
				</view>
			</view>
			</view>
			<view v-if="buttonText" style="background: #FFFFFF; padding: 15rpx; ">
				<button class="button-operation">
					<image
						:src="buttonText === '开始取送' ? '/static/images/logistics/开始.svg':'/static/images/logistics/完成.svg'"
						style="max-width: 45.8rpx;max-height: 45.8rpx; " mode=""></image>
					<text class="text-operation">{{buttonText}}</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonText: '开始取送',
			}
		},
	}
</script>

<style>
	uni-page-body {
		height: 100%;
	}
	.container-background {
		background: linear-gradient(180deg, rgba(89, 87, 230, 0.6) 0%, rgba(89, 87, 230, 0) 100%), #F0F1F5;
	}

	.container {
		width: 92%;
		height: 100%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.image {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
		margin: 20rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.line-clamp-3 {
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
		display: -webkit-box;
		height: 110rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.button-copy {
		height: 46rpx;
		background: #F5F6F8;
		border-radius: 191rpx
	}

	.text-copy {
		font-size: 27rpx;
		color: #808080;
		line-height: 42rpx;
		vertical-align: top;
	}

	.font-style .uv-form-item__body {
		font-size: 27rpx;
		color: #808080;
		line-height: 42rpx;
	}

	.uv-form-item.align-right.font-style .uv-form-item__body .uv-form-item__body__right {
		flex: none;
		margin-left: auto;
	}

	.button-operation {
		height: 69rpx;
		background: #333333;
		border-radius: 191rpx;
		margin-right: 0;
		width: 250rpx;
	}

	.text-operation {
		font-weight: 500;
		font-size: 27rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 42rpx;
		vertical-align: super;
	}
</style>