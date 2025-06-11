<template>
	<view class="page-container">
		<uv-empty v-if="isEmpty" mode="data"></uv-empty>
		<view v-else-if="!loading" class="padding-sm">
			<view class="card-ui flex-row align-center padding-tb">
				<image class="svg-icon large"
					:src="isFinished?'/static/images/productionReport/finished.svg':'/static/images/productionReport/待完成.svg'">
				</image>
				<text class="text-title h1">{{orderDetail.productionTechnologyName}}{{orderDetail.uStatusDesc}}</text>
			</view>
			<block v-for="item in detailCardList" :key="item.type">
				<view v-if="item.enabled" class="card-ui">
					<view class="card-ui-head">
						<view class="flex-row align-center">
							<image class="svg-icon" :src="item.icon"></image>
							<text class="text-title h2">{{item.label}}</text>
						</view>
						<uv-icon @click="item.display = !item.display"
							:name="item.display?'arrow-up':'arrow-down'"></uv-icon>
					</view>
					<template v-if="item.display && item.type==='finished'">
						<view class="svg-offset">

						</view>
					</template>
					<template v-if="item.display && item.type==='orderCount'">
						<view class="number-box margin-bottom-xs">
							<view class="number-box-title">
								<view>
									报工方式:{{orderDetail.workRptTypeDesc}}
								</view>
								待完成数量({{orderDetail.unCompleteCount}})
							</view>
							<view class="number-counter">
								<uv-button @click="decrement" :disabled="orderCount === 1"><uv-icon
										name="minus"></uv-icon></uv-button>
								<uv-input type="number" v-model="orderCount"></uv-input>
								<uv-button @click="increment"
									:disabled="orderCount === orderDetail.unCompleteCount"><uv-icon
										name="plus"></uv-icon></uv-button>
							</view>
						</view>
						<view v-if="progressData.length > 0" class="composite-progress">
							<uv-line-progress :customStyle="customStyle" height="30" :showText="false">
							</uv-line-progress>
							<uv-line-progress v-for="(item, index) in progressData" :customStyle="customStyle"
								height="30" :percentage="getPercent(index)">
								<view class="progress-text"
									:style="{'z-index': 999 - index,background: progressColor[index]}">
									{{`${item.opreatorName}`}}{{`${item.num}`}}
								</view>
							</uv-line-progress>
						</view>
					</template>
					<template v-if="item.display && item.type==='upload'">
						<view class="cover-list padding-sm">
							<view class="image-wrap" v-for="(file,index) in attachmentInfos" :key="index">
								<uv-image :src="file.fullPath" width="100%" height="100%" radius="10rpx"></uv-image>
								<view class="close-icon-wrap" @click="removeFile(index)">
									<uv-icon name="close"></uv-icon>
								</view>
							</view>
							<view
								:class="['flex-column align-center justify-center',attachmentInfos.length>0?'image-wrap':'flex-1']"
								@click="onUploadFile">
								<uv-icon name="camera" size="80rpx"></uv-icon>
								<text class="text-sm text-info">点击上传图片</text>
							</view>
						</view>
					</template>
					<template v-if="item.display && item.type==='preview'">
						<view class="cover-list">
							<image class="image-wrap" v-for="(item,index) in orderDetail.sourcePreviewUrls" :key="index"
								:src="item.imageUrl"></image>
						</view>
					</template>
					<template v-if="item.display && item.type==='remark'">
						<view class="svg-offset text-sm">
							{{orderDetail.remark}}
						</view>
					</template>
					<template v-if="item.display && item.type==='productProgress'">
						<view class="flex-row align-center">
							<text class="process-latest">
								【当前进度】：{{orderDetail.curProductionTechnologyName}}
							</text>
							<view class="process-btn" @click="item.showMore = !item.showMore">
								{{item.showMore? '收起' : '所有流程'}}
								<uv-icon :name="item.showMore? 'arrow-up' : 'arrow-down'"></uv-icon>
							</view>
						</view>
						<view v-if="item.showMore">
							<view v-for="(item, index) in orderDetail.orderItemAllTechs" :key="index">
								<view class="component-name">{{item.componentName}}</view>
								<uv-steps
									:customStyle="{width: `${Math.min(item.technologyStatuses.length / 10 * 100, 100)}%`, overflow: 'scroll'}">
									<uv-steps-item v-for="(tech, indx) in item.technologyStatuses" :key="indx">
										<template v-slot:title>
											<text class="steps-title">{{tech.technologyName}}</text>
										</template>
										<template v-slot:icon>
											<image class="steps-icon" :src="getProcessImg(tech, index)">
											</image>
										</template>
									</uv-steps-item>
								</uv-steps>
							</view>
						</view>
					</template>
					<template v-if="item.display && item.type==='orderInfo'">
						<view class="order-info-wrap">
							<view class="order-item">
								<text class="order-label">生产信息 ：</text>
								<text class="order-label-info">{{orderDetail.productName}}</text>
							</view>
							<template v-if="item.showMore">
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
								<uv-icon @click="item.showMore = !item.showMore"
									:name="item.showMore?'arrow-up':'arrow-down'" :label="item.showMore?'收起':'展开'"
									label-size="27rpx" label-pos="left" color="#808080" label-color="#808080"></uv-icon>
							</view>
						</view>
					</template>
					<template v-if="item.display && item.type==='previewFiles'">
						<block v-for="(item,index) in orderDetail.sourceFileUrls" :key="index">
							<view class="preview-wrap">
								<text class="text-sm text-info">原文件预览：</text>
								<view class="file-wrap padding-top-sm">
									<image class="svg-icon" src="/static/images/productionReport/file.svg"></image>
									<text class="text-sm">{{item.fileName}}</text>
									<image class="svg-icon" src="/static/images/productionReport/download.svg"
										@click="downloadFile(item.imageUrl)"></image>
								</view>
							</view>
						</block>
					</template>
				</view>
			</block>
		</view>
		<template v-if="!isEmpty">
			<view class="footer-height"></view>
			<view class="page-footer">
				<view class="padding-sm">
					<button v-if="isFinished" type="default" class="list-button" @click="navigateBack()">
						<image class="list-image" src="/static/images/productionReport/箭头.svg"></image>
						<text class="button-text">回到工艺选择页</text>
					</button>
					<button v-else type="default" class="list-button" @click="onConfirm()">
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
				orderCount: 0,
				isEmpty: false,
				loading: true,
				isFinished: false,
				attachmentInfos: [], // 附件
				progressData: [],
				thingId: null,
				progressColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'],
				customStyle: {
					position: 'absolute',
					top: 0,
					width: '100%',
				},
				detailCardList: [{
					label: '完工信息',
					icon: '/static/images/productionReport/finished.svg',
					type: 'finished',
					enabled: true,
					display: true
				}, {
					label: '填写本次完成数量',
					icon: '/static/images/productionReport/数量.svg',
					type: 'orderCount',
					enabled: true,
					display: true
				}, {
					label: '上传图片(选填)',
					icon: '/static/images/productionReport/文件.svg',
					type: 'upload',
					enabled: true,
					display: true
				}, {
					label: '工艺预览',
					icon: '/static/images/productionReport/文件.svg',
					type: 'preview',
					enabled: true,
					display: true
				}, {
					label: '制作备注',
					icon: '/static/images/productionReport/编辑.svg',
					type: 'remark',
					enabled: true,
					display: true
				}, {
					label: '生产进度',
					icon: '/static/images/productionReport/生产进度.svg',
					type: 'productProgress',
					enabled: true,
					display: true,
					showMore: false,
				}, {
					label: '订单信息',
					icon: '/static/images/productionReport/基础信息.svg',
					type: 'orderInfo',
					enabled: true,
					display: true,
					showMore: false,
				}, {
					label: '文件预览',
					icon: '/static/images/productionReport/文件.svg',
					type: 'previewFiles',
					enabled: true,
					display: true
				}],

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
			this.thingId = options.thingId === 'null' ? null : options.thingId
		},
		methods: {
			getDetail(params) {
				GetTechnologyOrderItemDetail({
					orderItemNo: params.orderItemNo,
					productionTechnologyId: params.technologyId
				}).then(res => {
					if (res.code === 0) {
						this.orderDetail = res.data
						this.orderCount = this.orderDetail.unCompleteCount
						this.isFinished = this.orderDetail.uStatus === 1
						this.progressData = res.data.curTechWorkItemRecords
						this.updateDetailCardList()
					} else {
						uni.$uv.toast('订单详情加载失败')
					}
				}).finally(() => {
					this.loading = false
					this.isEmpty = this.orderDetail === null
				})
			},
			updateDetailCardList() {
				const conditions = {
					finished: () => this.isFinished,
					orderCount: () => !this.isFinished,
					upload: () => !this.isFinished,
					preview: () => this.orderDetail.sourcePreviewUrls.length > 0,
					remark: () => this.orderDetail.remark
				};

				this.detailCardList.forEach(card => {
					const condition = conditions[card.type];
					if (condition) {
						card.enabled = condition();
						card.display = condition();
					}
				});
			},
			increment() {
				this.orderCount++;
			},
			decrement() {
				this.orderCount--;
			},
			// 上传图片
			onUploadFile() {
				const self = this
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
							header: {
								Authorization: `Bearer ${uni.getStorageSync('token')}`,
							},
							success: (uploadFileRes) => {
								const {
									code,
									data,
									message
								} = JSON.parse(uploadFileRes.data)
								if (code === 0) {
									self.attachmentInfos = [...self.attachmentInfos, ...data]
									console.log('uploadFile success file', self.attachmentInfos);
								} else {
									uni.$uv.toast(message)
								}
							}
						});
					}
				})
			},
			// 移除上传图片
			removeFile(index) {
				this.attachmentInfos.splice(index, 1)
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
			navigateBack() {
				uni.navigateBack({
					delta: 2
				});
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
					makeQuantity: this.orderCount, // 完成件数
					attachmentInfos: this.attachmentInfos,
					thingId: this.thingId
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
			},
			maxTechnolgiesIndex(index) {
				return Math.max(
					...this.orderDetail.orderItemAllTechs[index].technologyStatuses
					.filter((item) => item.status == 1)
					.map((d) => d.cIndex)
				);
			},
			getProcessImg(tech, index) {
				if (tech.cIndex < this.maxTechnolgiesIndex(index) + 1) {
					if (tech.status == 0) {
						return '/static/images/productionReport/skip.svg'
					}

					return '/static/images/productionReport/finished.svg'
				}

				return '/static/images/productionReport/start.svg'
			},
			getPercent(index) {
				return this.progressData.slice(0, index + 1).reduce((prev, cur) => prev + cur.num, 0) / this.orderDetail
					.orderCount * 100
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
			width: 62rpx;
			height: 62rpx;
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

			.note {
				font-size: 23rpx;
			}
		}

		.number-counter {
			display: grid;
			grid-template-columns: 1fr 2fr 1fr;
			grid-auto-rows: 60rpx;
			column-gap: 10rpx;
		}
	}

	.composite-progress {
		position: relative;
		padding-bottom: 50rpx;

		.progress-text {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-size: 23rpx;
			width: 100%;
			height: 100%;
			text-align: right;
		}
	}

	.cover-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190rpx, 1fr));
		gap: 10rpx;

		.image-wrap {
			position: relative;
			width: 190rpx;
			height: 190rpx;
			border-radius: 10rpx;
		}

		.image-cover {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}

		.close-icon-wrap {
			position: absolute;
			top: 0;
			right: 0;
			background-color: #ccc;
			padding: 5rpx 10rpx;
			border-radius: 0rpx 10rpx 0rpx 12rpx;
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

	.process-latest {
		font-weight: 500;
		font-size: 27rpx;
		color: #333333;
		line-height: 42rpx;
		flex: 1;
	}

	.process-btn {
		font-size: 23rpx;
		color: #808080;
		line-height: 34rpx;
		background: #F7F7F7;
		border-radius: 191rpx;
		padding: 5rpx 15rpx;
		display: flex;
	}

	.component-name {
		font-weight: 800;
		font-size: 27rpx;
		line-height: 42rpx;
		margin-left: 19rpx
	}

	.steps-title {
		font-weight: 400;
		font-size: 23rpx;
		color: #808080;
		line-height: 34rpx;
	}

	.steps-icon {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
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