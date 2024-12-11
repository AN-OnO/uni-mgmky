<template>
	<view class="earning-contain">
		<uv-sticky bgColor='#D5E8FF'>
			<view class="renderBtn-contain">
				<view class="content-wrap" :style="{maxHeight: wrapHeight}">
					<view class="btn-contain">
						<button v-for="(item, index) in btnList" :key="index"
							:class="selectedIndex == index ? 'selected-btn' : 'other-btn'" @click="clickBtn(index)">
							<text class="text">{{item}}</text>
						</button>
					</view>
				</view>
				<image v-show="showOpen" class="btn-img" src="/static/images/tabbar/down-arrow.svg" mode=""
					@click="open"></image>
				<image v-show="showClose" class="btn-img" src="/static/images/tabbar/up-arrow.svg" mode=""
					@click="close"></image>
			</view>
			<view class="subsection-contain">
				<view @click="openTitle" class="mode-title">
					{{modeTitle}}
					<image v-show="modeTitle != '累计'" src="/static/images/tabbar/arrow-tabs.svg" class="arrow-img">
					</image>
				</view>
				<uv-datetime-picker ref="datetimePicker" v-model="value" :mode="mode"
					@confirm="confirm"></uv-datetime-picker>
				<view class="sub-section"><uv-subsection :list="['日', '月', '累计']" :current="current"
						@change="change"></uv-subsection></view>
			</view>
			<view class="total-earning">
				完成56单，收益322.56元
			</view>
		</uv-sticky>
		<view class="earning-card">
			<view style="display: flex;">
				<view class="tag-contain">
					<text class="card-number">240820000041478</text>
					<view class="tag"><text class="tag-text">拼版</text></view>
				</view>
				<text class="earning-value">+24.50</text>
			</view>
			<view class="companyName">
				TO63226 汝河路-永昌广告印务
			</view>
			<view class="earning-time">
				2024-11-08 03:05:20
			</view>
		</view>
		<view class="earning-card">
			<view style="display: flex;">
				<view class="tag-contain">
					<text class="card-number">240820000041478</text>
					<view class="tag"><text class="tag-text">拼版</text></view>
				</view>
				<text class="earning-value">+24.50</text>
			</view>
			<view class="companyName">
				TO63226 汝河路-永昌广告印务
			</view>
			<view class="earning-time">
				2024-11-08 03:05:20
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	export default {
		data() {
			const date = dayjs().subtract(1, 'day');

			return {
				modeTitle: date.format('YYYY/MM/DD'),
				value: Number(date),
				mode: 'date',
				current: 0,
				selectedIndex: 0,
				showOpen: false,
				showClose: false,
				wrapHeight: '80rpx',
				btnList: ['全部', '快递', '制作', '审核', '拼版', '其他']
			}
		},
		onReady() {
			this.change(0)
			
			let wrapHeight = 0;
			let spaceHeight = 0;
			uni.createSelectorQuery().select('.content-wrap').boundingClientRect(data => {
				wrapHeight = data.height
			}).exec()
			uni.createSelectorQuery().select('.btn-contain').boundingClientRect(data => {
				spaceHeight = data.height
				if (spaceHeight > wrapHeight) {
					this.showOpen = true
				}
			}).exec()
		},
		methods: {
			open() {
				this.wrapHeight = '999rpx'
				this.showOpen = false;
				this.showClose = true
			},
			close() {
				this.wrapHeight = '65rpx'
				this.showOpen = true;
				this.showClose = false
			},
			confirm(e) {
				const date = dayjs(e.value);

				if (e.mode == 'year-month') {
					this.modeTitle = date.format('YYYY/MM')
				} else {
					this.modeTitle = date.format('YYYY/MM/DD')
				}
			},
			change(index) {
				const date = dayjs().subtract(1, 'day')

				if (index == 0) {
					this.mode = 'date';
					this.modeTitle = date.format('YYYY/MM/DD');
				} else if (index == 1) {
					this.mode = 'year-month';
					this.modeTitle = dayjs().format('YYYY/MM')
				} else {
					this.modeTitle = '累计'
				}

				this.current = index;
				this.value = Number(date)
			},
			openTitle() {
				if (this.modeTitle != '累计') {
					this.$refs.datetimePicker.open();
				}
			},
			clickBtn(index) {
				this.selectedIndex = index
			}
		}
	}
</script>

<style lang="scss">
	.earning-contain {
		background: linear-gradient(180deg, #D5E8FF 0%, #F3F6FA 100%), #F5F6F8;
		height: 100%;
		padding: 30rpx;
	}

	.renderBtn-contain {
		display: flex;
		justify-content: space-between;

		.content-wrap {
			overflow: hidden;

			.btn-contain {
				display: flex;
				flex-wrap: wrap;

				.selected-btn {
					background: #2FB7DF;
					border-radius: 8rpx;
					height: 65rpx;
					margin: 0 11.45rpx 15rpx 0;
					display: flex;
					align-items: center;

					.text {
						font-weight: 500;
						font-size: 27rpx;
						color: #FFFFFF;
						line-height: 42rpx;
					}
				}

				.other-btn {
					height: 65rpx;
					margin: 0 11.45rpx 15rpx 0;
					background: #FFFFFF;
					border-radius: 8rpx;
					display: flex;
					align-items: center;

					.text {
						font-weight: 500;
						font-size: 27rpx;
						color: #808080;
						line-height: 42rpx;
					}
				}
			}
		}



		.btn-img {
			max-width: 64.89rpx;
			max-height: 64.89rpx;
			border-radius: 7.63rpx;
			margin-bottom: 15rpx;
		}

	}

	.subsection-contain {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 30rpx 0 15rpx 0
	}

	.mode-title {
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 31rpx;
		color: #333333;
		line-height: 46rpx;

		.arrow-img {
			max-width: 30.53rpx;
			max-height: 30.53rpx;
		}
	}

	.sub-section {
		width: 282rpx;
		background: #D8E4F3;
		border-radius: 15rpx
	}

	.total-earning {
		font-weight: 500;
		font-size: 31rpx;
		color: #808080;
		line-height: 46rpx;
		margin-bottom: 30rpx;
	}

	.earning-card {
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 15rpx;
		margin-bottom: 15.27rpx;
	}

	.tag-contain {
		display: flex;
		flex: 1;
	}

	.card-number {
		font-weight: bold;
		font-size: 42rpx;
		color: #333333;
		line-height: 50rpx;
		margin-right: 22.9rpx;
	}

	.tag {
		width: 76rpx;
		height: 46rpx;
		background: #2FB7DF;
		border-radius: 8rpx;
		text-align: center;
	}

	.tag-text {
		font-weight: 500;
		font-size: 23rpx;
		color: #FFFFFF;
		line-height: 38rpx;
	}

	.earning-value {
		font-weight: 500;
		font-size: 34rpx;
		color: #2FB7DF;
		line-height: 46rpx;
	}

	.companyName {
		font-weight: 500;
		font-size: 27rpx;
		color: #333333;
		line-height: 38rpx;
	}

	.earning-time {
		font-weight: 400;
		font-size: 27rpx;
		color: #808080;
		line-height: 38rpx;
	}
</style>