<template>
	<view class="page-container">
		<uv-empty v-if="isEmpty" mode="data" icon="https://cdn.uviewui.com/uview/empty/data.png"></uv-empty>
		<view v-else-if="!loading" class="padding-sm">
			<view class="card-ui flex-row align-center padding-tb">
				<image class="svg-icon large"
					:src="isFinished?'/static/images/productionReport/已完成.svg':'/static/images/productionReport/待完成.svg'">
				</image>
				<text class="text-title h1">{{orderDetail.productionTechnologyName}}{{orderDetail.uStatusDesc}}</text>
			</view>
			<block v-for="item in detailCardList" :key="item.type">
				<view class="card-ui">
					<view class="card-ui-head">
						<view class="flex-row align-center">
							<image class="svg-icon" :src="item.icon"></image>
							<text class="text-title h2">{{item.label}}</text>
							<text v-if="item.remark" class="text-tips text-bold">{{item.remark}}</text>
						</view>
						<uv-icon @click="item.display = !item.display"
							:name="item.display?'arrow-up':'arrow-down'"></uv-icon>
					</view>
					<template v-if="item.display && item.type==='orderCount'">
						<view class="number-box">
							<text class="number-box-title">待完成数量({{orderDetail.unCompleteCount}})</text>
							<view class="number-counter">
								<uv-button @click="decrement" :disabled="orderDetail.unCompleteCount === 0"><uv-icon
										name="minus"></uv-icon></uv-button>
								<uv-input type="number" v-model="orderDetail.unCompleteCount"></uv-input>
								<uv-button @click="increment"><uv-icon name="plus"></uv-icon></uv-button>
							</view>
						</view>
					</template>
					<template v-if="item.display && item.type==='upload'">
						<view class="flex-column align-center padding" @click="onUploadFile">
							<uv-icon name="camera" size="80rpx"></uv-icon>
							<text class="text-sm text-info">点击上传图片</text>
						</view>
					</template>
					<template v-if="item.display && item.type==='preview'">
						<view class="cover-list">
							<image class="image-cover" v-for="(item,index) in orderDetail.sourcePreviewUrls"
								:key="index" :src="item.imageUrl"></image>
						</view>
					</template>
					<template v-if="item.display && item.type==='remark'">
						<view class="svg-offset text-sm">
							{{orderDetail.remark}}
						</view>
					</template>
					<template v-if="item.display && item.type==='orderInfo'">
						<view class="order-info-wrap">
							<view class="order-item">
								<text class="order-label">生成信息 ：</text>
								<text class="order-label-info">{{orderDetail.productName}}</text>
							</view>
							<template v-if="showMore">
								<view class="order-item">
									<text class="order-label">订单号 ：</text>
									<text class="order-label-info">{{orderDetail.saleOrderNo}}</text>
								</view>
								<view class="order-item">
									<text class="order-label">生产单号 ：</text>
									<text class="order-label-info">{{orderDetail.orderItemNo}}</text>
								</view>
								<view class="order-item">
									<text class="order-label">下单信息 ：</text>
									<text class="order-label-info">{{orderDetail.checkintime}}</text>
								</view>
							</template>
							<view class="flex-row justify-end">
								<uv-icon @click="showMore = !showMore" :name="showMore?'arrow-up':'arrow-down'"
									:label="showMore?'收起':'展开'" label-size="27rpx" label-pos="left" color="#808080"
									label-color="#808080"></uv-icon>
							</view>
						</view>
					</template>
					<template v-if="item.display && item.type==='previewFiles'">
						<view class="preview-wrap" v-for="(item,index) in orderDetail.sourceFileUrls" :key="index">
							<text class="text-sm text-info">原文件预览：</text>
							<view class="file-wrap padding-top-sm">
								<image class="svg-icon" src="/static/images/productionReport/file.svg"></image>
								<text class="text-sm">{{item.fileName}}</text>
								<image class="svg-icon" src="../../static/images/productionReport/下载.svg"
									@click="downloadFile(item.imageUrl)"></image>
							</view>
						</view>
						<!-- <view class="preview-wrap">
							<text class="text-sm text-info">原文件预览(封面)：</text>
							<view class="cover-list padding-top-sm">

							</view>
							<uv-line margin="30rpx 0"></uv-line>
							<text class="text-sm text-info">原文件预览(内页)：</text>
							<view class="file-wrap padding-top-sm">
								<image class="svg-icon large" src="/static/images/productionReport/file.svg"></image>
								<view class="flex-column">
									<text class="text-sm">文件名称.pdf</text>
									<text class="text-sm text-info">35.15MB</text>
								</view>
								<image class="svg-icon" src="/static/images/productionReport/下载.svg"></image>
							</view>
						</view> -->
					</template>
				</view>
			</block>
		</view>
		<template v-if="!isFinished&&!isEmpty">
			<view class="footer-height"></view>
			<view class="page-footer">
				<view class="padding-sm">
					<button type="default" class="list-button" @click="onConfirm()">
						<image class="list-image" src="/static/images/logistics/完成.svg"></image>
						<text class="button-text">完成报工</text>
					</button>
				</view>
			</view>
		</template>

		<uv-loading-page :loading="loading"></uv-loading-page>
	</view>
</template>

<script>
	import {
		ScanResult,
		GetOrderItemAndTrackings,
		GetTechnologyOrderItemDetail
	} from '@/apis/production'
	import {
		baseURL
	} from '@/common/config'

	export default {
		data() {
			return {
				orderDetail: null,
				isEmpty: false,
				loading: true,
				isFinished: false,
				attachmentInfos: [], // 附件
				detailCardList: [{
					label: '填写本次完成数量',
					icon: '/static/images/productionReport/数量.svg',
					remark: '',
					type: 'orderCount',
					display: true
				}, {
					label: '上传图片(选填)',
					icon: '/static/images/productionReport/文件.svg',
					remark: '',
					type: 'upload',
					display: true
				}, {
					label: '工艺预览',
					icon: '/static/images/productionReport/文件.svg',
					remark: '',
					type: 'preview',
					display: true
				}, {
					label: '制作备注',
					icon: '/static/images/productionReport/编辑.svg',
					remark: '(下单的时候没有填就不显示)',
					type: 'remark',
					display: true
				}, {
					label: '订单信息',
					icon: '/static/images/productionReport/基础信息.svg',
					remark: '',
					type: 'orderInfo',
					display: true
				}, {
					label: '文件预览',
					icon: '/static/images/productionReport/文件.svg',
					remark: '',
					type: 'previewFiles',
					display: true
				}],
				showMore: false
			}
		},
		onLoad(options) {
			if (Object.keys(options).length === 0) {
				this.loading = false
				this.isEmpty = true
				return uni.$uv.toast('页参异常')
			}

			console.log('options', options)
			this.getDetail(options)
		},
		methods: {
			getDetail(params) {
				GetTechnologyOrderItemDetail({
					orderItemNo: params.orderItemNo,
					productionTechnologyId: params.technologyId
				}).then(res => {
					if (res.code === 0) {
						this.orderDetail = res.data
						this.isFinished = this.orderDetail.uStatus === 1
					} else {
						uni.$uv.toast('订单详情加载失败')
					}
				}).finally(() => {
					this.loading = false
					this.isEmpty = this.orderDetail === null
				})
			},
			increment() {
				this.orderDetail.unCompleteCount++;
			},
			decrement() {
				this.orderDetail.unCompleteCount--;
			},
			// 上传图片
			onUploadFile() {
				uni.chooseMedia({
					count: 1,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					camera: 'back',
					success(res) {
						const tempFilePaths = res.tempFiles
						uni.uploadFile({
							url: baseURL + '/api/FileUpload/UploadFile',
							filePath: tempFilePaths[0].tempFilePath,
							name: 'file',
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
								const {
									code,
									data,
									message
								} = uploadFileRes.data
								if (code === 0) {

								} else {
									uni.$uv.toast(message)
								}
								// {"code":0,"message":"请求成功","data":[{"originalFileName":"0WLdKe4vBg3L84ca42e2ec1e7f2145a19bd2e6468607.png","savedFileName":"98a6bb06-63d4-4528-86f4-f942cc31294c.png","filePath":"/uploads/98a6bb06-63d4-4528-86f4-f942cc31294c.png","fileSize":3144,"extension":".png"}]}
							}
						});
					}
				})
			},
			// 移除上传图片
			removeFile() {

			},
			downloadFile(fileUrl) {
				const downloadTask = uni.downloadFile({
					url: fileUrl,
					success: (res) => {
						console.log('下载结果', res);
						if (res.statusCode === 200) {
							uni.$uv.toast('下载成功')
						} else {
							uni.$uv.toast('下载失败')
						}
					},
					fail: (err) => {
						console.error('下载失败', err);
					}
				});

				downloadTask.onProgressUpdate((res) => {
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});

			},
			// 完成报工
			onConfirm() {
				uni.showModal({
					title: '提示',
					content: '您是否确认完成任务？',
					success: ({
						confirm
					}) => confirm && this.completeTask()
				})
			},
			completeTask(order) {
				if (this.orderDetail.unCompleteCount > this.orderDetail.orderCount) {
					return uni.$uv.toast('待完成数量不能超过订购数量！')
				}
				const navigateBack = (success = false) => {
					success && uni.$Utils.navigateBack()
				}
				ScanResult({
					scanResult: this.orderDetail.orderItemNo,
					technologyid: this.orderDetail.productionTechnologyId,
					// checkinType: 0, // 1：切换 2：覆盖 3：新增
					// employeeId: "",
					makeQuantity: this.orderDetail.unCompleteCount // 完成件数
				}).then(res => {
					const success = res.code === 0
					let message = success ? '任务已完成！' : (res.message || '任务完成失败！')

					uni.showModal({
						title: '提示',
						content: message,
						showCancel: false,
						success: ({
							confirm
						}) => confirm && navigateBack(success)
					})
				})

			},
			onCopy(text) {
				uni.setClipboardData({
					data: text,
					success: function() {
						uni.$uv.toast('复制成功')
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$footerHeight: 120rpx;
	$radius: 15rpx;

	.page-container {
		background-color: #F0F1F5;
		min-height: 100%;
		box-sizing: border-box;
	}

	.card-ui {
		background-color: #fff;
		border-radius: $radius;
		padding: 20rpx;

		&-head {
			@include flex;
			justify-content: space-between;
			padding-bottom: 20rpx;
		}

		.hidden {
			height: 0;
			overflow: hidden;
			transition: height 10s ease;
		}
	}

	.card-ui+.card-ui {
		margin-top: 20rpx;
	}

	.footer-height {
		height: $footerHeight;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
	}

	.page-footer {
		position: fixed;
		z-index: 990;
		bottom: 0;
		left: 0;
		right: 0;
		height: $footerHeight;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: constant(safe-area-inset-bottom);
		border: 2rpx solid #F2F3F5;
	}

	.svg-icon {
		width: 45rpx;
		height: 45rpx;
		margin-right: 10rpx;

		&.large {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.svg-offset {
		padding-left: 55rpx;
	}

	.text-title {
		color: #333;
		font-weight: 600;

		&.h1 {
			font-size: 46rpx;
		}

		&.h2 {
			font-size: 34rpx;
		}
	}

	.text-tips {
		color: #FF6F1E;
		font-size: 26rpx;
	}

	.number-box {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;

		&-title {
			font-size: 27rpx;
			color: #333333;
			line-height: 42rpx;
		}

		.number-counter {
			display: grid;
			grid-template-columns: 1fr 2fr 1fr;
			grid-auto-rows: 60rpx;
			column-gap: 10rpx;
		}
	}

	.cover-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180rpx, 1fr));
		gap: 10rpx;

		.image-cover {
			width: 180rpx;
			height: 180rpx;
		}
	}

	.preview-wrap {
		background: #F5F6F8;
		border-radius: $radius;
		padding: 30rpx;
		@extend .svg-offset;

		.file-wrap {
			display: grid;
			grid-template-columns: auto 1fr auto;
			align-items: center;
		}
	}

	.preview-wrap+.preview-wrap {
		margin-top: 20rpx;
	}

	.order-info-wrap {
		@extend .svg-offset;

		.order-item {
			display: flex;
			align-items: flex-start;
			margin: 15rpx 0;
			line-height: 46rpx;
		}

		.order-label {
			font-size: 27rpx;
			color: #808080;
			margin-right: 20rpx;
		}

		.order-label-info {
			flex: 1;
			font-size: 27rpx;
			text-align: right;
		}
	}

	/* 此按钮样式可作为公共样式 */
	.list-button {
		height: 90rpx;
		background: #2FB7DF;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list-image {
		width: 50rpx;
		height: 50rpx;
	}

	.button-text {
		font-weight: 500;
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 42rpx;
		vertical-align: super;
	}
</style>