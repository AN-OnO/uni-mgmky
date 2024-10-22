<template>
	<view>
		<view class="flex-between">
			<view @click="open" class="mode-title">
				{{modeTitle}}<uv-icon name="arrow-down-fill" size="16"></uv-icon>
			</view>
			<uv-datetime-picker ref="datetimePicker" v-model="value" :mode="mode"
				@confirm="confirm"></uv-datetime-picker>
			<!-- <uv-calendars ref="calendars" @confirm="confirm" mode="range" allowSameDay /> -->
			<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['日', '月', '年']"
					:current="current" @change="change"></uv-subsection></view>
		</view>
		<view v-for="(ele, indx) in dataList" :key="indx">
			<view>
				<view style="padding: 30rpx;">
					<text class="section-title">{{ele.name}}</text>
				</view>
				<view class="section-content">
					<view v-for="(item, index) in ele.content" :key="index" class="ele-content">
						<view class="ele-title">{{item.title}}<text
								:class="`${Number(item.increase) > 0 ? 'ele-basis positive' : 'ele-basis negative'}`">{{Number(item.increase) > 0 ? `+${item.increase}` : item.increase }}</text>
						</view>
						<view class="ele-value">
							{{item.number}}
						</view>
					</view>
				</view>
				<view class="bottom-line"></view>
			</view>
		</view>
		<view>
			<view class="flex-between" style="padding: 30rpx;">
				<text class="section-title">订单金额占比</text>
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['订单来源', '产品品类']"
						:current="currentSource" @change="changeSource"></uv-subsection></view>
			</view>
			<div id="main" style="width: 600rpx;height:305rpx;"></div>
		</view>
	</view>
</template>

<script>
	import {
		GetOrderStat
	} from '../../apis/member';
	import {
		useUserStore
	} from '../../store/user';
	import dayjs from 'dayjs';
	import Big from 'big.js';
	import * as echarts from 'echarts';
	export default {
		data() {
			return {
				value: Number(new Date()),
				mode: 'date',
				modeTitle: `${dayjs().format('YYYY-MM-DD')}`,
				current: 0,
				currentSource: 0,
				dataList: [{
						name: '订单数量统计(单)',
						content: [{
							title: '所有订单',
							increase: 0,
							number: 0
						}, {
							title: '内部下单',
							increase: 0,
							number: 0
						}, {
							title: '微信订单',
							increase: 0,
							number: 0
						}, {
							title: '网站下单',
							increase: 0,
							number: 0
						}]
					},
					{
						name: '订单金额统计(元)',
						content: [{
							title: '所有订单',
							increase: 0,
							number: 0
						}, {
							title: '内部下单',
							increase: 0,
							number: 0
						}, {
							title: '微信订单',
							increase: 0,
							number: 0
						}, {
							title: '网站下单',
							increase: 0,
							number: 0
						}]
					}
				]
			}
		},
		onLoad() {
			this.change(0)
		},
		onReady() {
			this.getEcharts()
		},
		methods: {
			change(index) {
				if (index == 0) {
					this.mode = 'date';
					const date = dayjs().format('YYYY-MM-DD');
					this.modeTitle = date;
					this.getOrderStat(date, date)
				} else if (index == 1) {
					this.mode = 'year-month';
					this.modeTitle = dayjs().format('YYYY-MM')
					this.getOrderStat(dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format(
						'YYYY-MM-DD'))
				} else {
					this.mode = 'year';
					this.modeTitle = dayjs().format('YYYY')
					const year = dayjs().year()
					this.getOrderStat(`${year}-01-01`, `${year}-12-31`)
				}
				this.current = index;
				this.value = Number(new Date())
			},
			changeSource() {

			},
			open() {
				// if (this.mode == 'date') {
				// 	this.$refs.calendars.open();
				// } else {
				this.$refs.datetimePicker.open();
				// }
			},
			confirm(e) {
				if (e.range) {
					// 选择日期范围
					// this.modeTitle = `${startTime}/${endTime}`
					this.getOrderStat(e.range.before, e.range.after)
					return
				}
				const year = dayjs(e.value).year();

				if (e.mode == 'year') {
					this.modeTitle = year
					this.getOrderStat(`${year}-01-01`, `${year}-12-31`)
				} else if (e.mode == 'year-month') {
					const month = dayjs(e.value).month() + 1;
					this.modeTitle = `${year}-${month}`
					this.getOrderStat(dayjs(e.value).startOf('month').format('YYYY-MM-DD'), dayjs(e.value).endOf('month')
						.format('YYYY-MM-DD'))
				} else {
					const date = dayjs(e.value).format('YYYY-MM-DD');
					this.modeTitle = date
					this.getOrderStat(date, date)
				}
			},
			getOrderStat(beginDate, endDate) {
				const userData = useUserStore().userData;
				GetOrderStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents.map(item => item.mercantileAgentId)
				}).then(res => {
					if (res.code === 0) {
						this.dataList[0].content[0].number = this.formatNumber(res.data.curPeriodCount.orderCount)
						this.dataList[0].content[1].number = this.formatNumber(res.data.curPeriodCount
							.innerOrderCount)
						this.dataList[0].content[2].number = this.formatNumber(res.data.curPeriodCount
							.weChatOrderCount)
						this.dataList[0].content[3].number = this.formatNumber(res.data.curPeriodCount
							.shoppingOrderCount)
						this.dataList[0].content[0].increase = this.formatNumber(res.data.curPeriodCount
							.orderCount - res.data
							.prevPeriodCount.orderCount)
						this.dataList[0].content[1].increase = this.formatNumber(res.data.curPeriodCount
							.innerOrderCount - res.data
							.prevPeriodCount.innerOrderCount)
						this.dataList[0].content[2].increase = this.formatNumber(res.data.curPeriodCount
							.weChatOrderCount - res.data
							.prevPeriodCount.weChatOrderCount)
						this.dataList[0].content[3].increase = this.formatNumber(res.data.curPeriodCount
							.shoppingOrderCount - res
							.data.prevPeriodCount.shoppingOrderCount)

						this.dataList[1].content[0].number = this.formatNumber(res.data.curPeriodAmount
							.orderAmount)
						this.dataList[1].content[1].number = this.formatNumber(res.data.curPeriodAmount
							.innerOrderAmount)
						this.dataList[1].content[2].number = this.formatNumber(res.data.curPeriodAmount
							.weChatOrderAmount)
						this.dataList[1].content[3].number = this.formatNumber(res.data.curPeriodAmount
							.shoppingOrderAmount)
						this.dataList[1].content[0].increase = this.formatNumber(new Big(res.data.curPeriodAmount
							.orderAmount).minus(res.data
							.prevPeriodAmount.orderAmount).toString())
						this.dataList[1].content[1].increase = this.formatNumber(new Big(res.data.curPeriodAmount
							.innerOrderAmount).minus(res.data
							.prevPeriodAmount.innerOrderAmount).toString())
						this.dataList[1].content[2].increase = this.formatNumber(new Big(res.data.curPeriodAmount
							.weChatOrderAmount).minus(res
							.data.prevPeriodAmount.weChatOrderAmount).toString())
						this.dataList[1].content[3].increase = this.formatNumber(new Big(res.data.curPeriodAmount
							.shoppingOrderAmount).minus(res
							.data.prevPeriodAmount.shoppingOrderAmount).toString())
					} else {
						uni.$Utils.showToast(res.message)
					}
				})
			},
			formatNumber(num) {
				// 将数字转换为字符串
				const numStr = num.toString();

				// 使用正则表达式添加千分符
				const [integerPart, decimalPart] = numStr.split('.');
				const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

				return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
			},
			getEcharts() {
				const myChart = echarts.init(document.getElementById('main'));
				const content = this.dataList[1].content;
				const data = [
				        { value: content[1].number, name: '内部下单',itemStyle: {color: '#3CC3DF'} },
				        { value: content[2].number, name: '微信订单',itemStyle: {color: '#6FD195'} },
				        { value: content[3].number, name: '网站下单',itemStyle: {color: '#F5C461'} },
				]
				const total = content.reduce((prev, cur) => new Big(prev).plus(cur.number).toString(), 0)
				const option = {
				  tooltip: {
				    trigger: 'item'
				  },
				  legend: {
					orient: 'vertical',
					icon: 'circle',
				    top: 'bottom',
				    left: '210rpx',
					formatter: function (name) {
					    return `${name}${content.find(item => item.title == name).number / total || 0}%`;
					}
				  },
				  series: [
				    {
				      name: '订单金额占比',
				      type: 'pie',
				      radius: ['40%', '70%'],
				      label: {
				        show: false,
				        position: 'center'
				      },
				      emphasis: {
				        label: {
				          show: true,
				          fontSize: 40,
				          fontWeight: 'bold'
				        }
				      },
				      data
				    }
				  ]
				};
				myChart.setOption(option);
			}
		}
	}
</script>

<style>
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.mode-title {
		display: flex;
		margin-left: 28rpx;
		font-weight: 500;
		font-size: 31rpx;
		color: #333333;
		line-height: 46rpx;
	}

	.sub-section {
		width: 300rpx;
		margin-right: 28rpx;
	}

	.section-title {
		position: relative;
		padding-left: 0.7em;
		font-weight: bold;
		font-size: 34rpx;
		color: #333333;
		line-height: 53rpx;
	}

	.section-title::before {
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

	.section-content {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin-bottom: 61rpx;
	}

	.ele-content {
		width: 300rpx;
		margin: 8rpx;
		padding: 15rpx;
		background: #FAFAFA;
		border-radius: 15rpx
	}

	.ele-title {
		font-size: 27rpx;
		color: #333333;
		line-height: 42rpx;
	}

	.ele-basis {
		font-weight: bold;
		font-size: 23rpx;
		line-height: 34rpx;

		border-radius: 8rpx;
		padding: 8rpx;
		margin: 8rpx;
	}

	.positive {
		color: #E37318;
		background: #FFF1E9;
	}

	.negative {
		color: #2BA471;
		background: #E3F9E9;
	}

	.ele-value {
		font-weight: bold;
		font-size: 42rpx;
		color: #333333;
		line-height: 61rpx;
	}

	.bottom-line {
		width: 100%;
		background: #F0F0F0;
		height: 15rpx;
	}
</style>