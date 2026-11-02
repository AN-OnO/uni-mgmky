<template>
	<view class="earning-contain">
		<uv-sticky bgColor='#F3E6C8'>
			<view class="renderBtn-contain">
				<view class="content-wrap" :style="{maxHeight: wrapHeight}">
					<view class="btn-contain">
						<button v-for="(item, index) in btnList" :key="index"
							:class="selectedIndex == index ? 'selected-btn' : 'other-btn'"
							@click="clickBtn(item, index)">
							<text class="text">{{item.name}}</text>
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
				完成{{completedOrderItemCount}}次报工，收益{{statPerformanceAmount}}元
			</view>
		</uv-sticky>
		<view v-for="(item, index) in dataList" :key="index" class="ticket earning-card">
			<view style="display: flex;">
				<view class="tag-contain">
					<text class="ticket-no card-number">{{item.saleOrderNo}}</text>
					<view class="tag"><text class="tag-text">{{item.technologyName}}</text></view>
				</view>
				<text class="earning-value">{{item.rewardValue > 0 ? `+${item.rewardValue}` : item.rewardValue}}</text>
			</view>
			<view class="companyName">
				{{item.orderItemNo}} {{item.companyName}}
			</view>
			<view class="earning-time">
				{{item.checkinTime}}
			</view>
		</view>
		<uv-load-more :status="status" @loadmore='loadMore' />
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import {
		ListMyPerformances
	} from '../../apis/member';
	import {
		ListMyProductionTechnology
	} from '../../apis/production';
	export default {
		data() {
			const date = dayjs().subtract(1, 'day');

			return {
				pageIndex: 1,
				count: 0,
				status: 'loadmore',
				productionTechnologyId: '',
				modeTitle: date.format('YYYY/MM/DD'),
				beginDate: date.format('YYYY-MM-DD'),
				endDate: date.format('YYYY-MM-DD'),
				completedOrderItemCount: 0,
				statPerformanceAmount: 0,
				value: Number(date),
				mode: 'date',
				current: 0,
				selectedIndex: 0,
				showOpen: false,
				showClose: false,
				wrapHeight: '80rpx',
				dataList: [],
				btnList: []
			}
		},
		onReachBottom() {
			this.loadMore()
		},
		async onReady() {
			await this.getBtnList()
			this.change(0);
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
				this.wrapHeight = '9999rpx'
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
					this.getListByMode('year-month', date)
				} else {
					this.getListByMode('date', date)
				}
				
				this.refresh()
			},
			change(index) {
				const date = dayjs().subtract(1, 'day')

				if (index == 0) {
					this.mode = 'date';
					this.getListByMode('date', date)
				} else if (index == 1) {
					this.mode = 'year-month';
					this.getListByMode('year-month', date)
				} else {
					this.getListByMode()
				}

				this.current = index;
				this.value = Number(date)
				this.refresh()
			},
			getListByMode(mode, date) {
				if (mode == 'date') {
					this.modeTitle = date.format('YYYY/MM/DD');
					this.beginDate = date.format('YYYY-MM-DD');
					this.endDate = date.format('YYYY-MM-DD');
				} else if (mode == 'year-month') {
					this.modeTitle = date.format('YYYY/MM');
					this.beginDate = date.startOf('month').format('YYYY-MM-DD');
					this.endDate = date.endOf('month').format('YYYY-MM-DD');
				} else {
					this.modeTitle = '累计';
					this.beginDate = null;
					this.endDate = null;
				}
			},
			openTitle() {
				if (this.modeTitle != '累计') {
					this.$refs.datetimePicker.open();
				}
			},
			clickBtn(item, index) {
				this.selectedIndex = index;
				this.productionTechnologyId = item.technologyId
				
				if (this.showClose) {
					this.close()
				}
				
				this.refresh()
			},
			getList() {
				ListMyPerformances({
					pageSize: 10,
					pageIndex: this.pageIndex,
					beginDate: this.beginDate,
					endDate: this.endDate,
					productionTechnologyId: this.productionTechnologyId,
				}).then((res) => {
					const {
						completedOrderItemCount,
						statPerformanceAmount,
						count,
						pageEntities
					} = res.data

					this.completedOrderItemCount = completedOrderItemCount
					this.statPerformanceAmount = statPerformanceAmount
					this.count = count

					if (this.pageIndex === 1) {
						this.dataList = pageEntities
					} else {
						this.dataList = [...this.dataList, ...pageEntities]
					}

					this.status = this.dataList.length < this.count ? 'loadmore' : 'nomore';
				}).finally(() => {
					if (this.status === 'loading') this.status = 'nomore'
				})
			},
			async getBtnList() {
				const res = await ListMyProductionTechnology()
				this.btnList = [{
					name: '全部'
				}, ...res.data.technologies]
			},
			loadMore() {
				if (this.dataList.length < this.count) {
					this.status = 'loading';
					this.pageIndex++;
					this.getList();
				}
			},
			refresh() {
				this.pageIndex = 1
				this.dataList = []
				this.getList()
			}
		}
	}
</script>

<style lang="scss">
	.earning-contain {
		background: var(--ticket-paper);
		min-height: 100%;
		padding: 24rpx 32rpx 40rpx;
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
					background: var(--stamp-red);
					border-radius: 0;
					border: 2rpx solid var(--ticket-edge);
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
					background: var(--ticket-face);
					border-radius: 0;
					border: 2rpx solid var(--perf-line);
					display: flex;
					align-items: center;

					.text {
						font-weight: 500;
						font-size: 27rpx;
						color: var(--ink-muted);
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
		color: var(--ink-black);
		line-height: 46rpx;

		.arrow-img {
			max-width: 30.53rpx;
			max-height: 30.53rpx;
		}
	}

	.sub-section {
		width: 282rpx;
		background: transparent;
		border: none;
		border-radius: 0;
	}

	.total-earning {
		font-weight: 500;
		font-size: 31rpx;
		color: var(--ink-muted);
		line-height: 46rpx;
		margin-bottom: 30rpx;
	}

	.earning-card {
		padding: 24rpx 24rpx 24rpx 8rpx;
		margin-bottom: 24rpx;
	}

	.tag-contain {
		display: flex;
		flex: 1;
	}

	.card-number {
		font-weight: bold;
		font-size: 32rpx;
		color: var(--ink-black);
		line-height: 50rpx;
		margin-right: 22.9rpx;
	}

	.tag {
		width: 76rpx;
		height: 46rpx;
		background: var(--stamp-red);
		border-radius: 0;
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
		color: var(--ink-green);
		line-height: 46rpx;
	}

	.companyName {
		font-weight: 500;
		font-size: 27rpx;
		color: var(--ink-black);
		line-height: 38rpx;
	}

	.earning-time {
		font-weight: 400;
		font-size: 27rpx;
		color: var(--ink-muted);
		line-height: 38rpx;
	}
</style>