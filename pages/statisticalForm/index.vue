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
				<view class="padding-30">
					<text class="section-title">{{ele.name}}</text>
				</view>
				<view class="section-content">
					<view v-for="(item, index) in ele.content" :key="index" class="ele-content">
						<view class="ele-title">{{item.title}}<text
								:class="`${Number(item.increase.replace(/,/g, '')) > 0 ? 'ele-basis positive' : 'ele-basis negative'}`">{{Number(item.increase.replace(/,/g, '')) > 0 ? `+${item.increase}` : item.increase }}</text>
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
			<view class="flex-between padding-30">
				<text class="section-title">订单金额占比</text>
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['订单来源', '产品品类']"
						:current="currentSource" @change="changeSource"></uv-subsection></view>
			</view>
			<div id="pie" style="width: 100%;height:305rpx;"></div>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">品类变化趋势</text>
			</view>
			<div id="line" style="width: 90%;height:374rpx; padding: 0 30rpx;"></div>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">订单金额排名(产品类)</text>
			</view>
			<view style="padding: 0rpx 30rpx;">
				<uni-table emptyText="暂无更多数据">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th width="50" align="left">排名</uni-th>
						<uni-th width="80" align="left">产品</uni-th>
						<uni-th width="90" align="right"><text class="quantity">数量</text></uni-th>
						<uni-th align="right"><text class="amount">金额</text></uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in orderRank" :key="index">
						<uni-td>
							<image
								:src="index == 0 ? '../../static/images/statisticalForm/gold.svg' : index == 1 ? '../../static/images/statisticalForm/silver.svg': '../../static/images/statisticalForm/bronze.svg'"
								class='medal-img'></image>
						</uni-td>
						<uni-td>{{item.productCategoryName}}</uni-td>
						<uni-td align="right">{{formatNumber(item.orderCountStat)}}</uni-td>
						<uni-td align="right">{{formatNumber(item.orderAmountStat)}}</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td><text class="total-text">合计</text></uni-td>
						<uni-td></uni-td>
						<uni-td align="right"><text class="total-text">{{formatNumber(orderRankCount)}}</text></uni-td>
						<uni-td align="right"><text class="total-text">{{formatNumber(orderRankAmount)}}</text></uni-td>
					</uni-tr>
				</uni-table>
			</view>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">印刷在产统计(件)</text>
			</view>
			<view class="printedStat-content">
				<text class="printedStat-total">总印数2231195，总套数1715</text>
				<view class="printedStat-line"></view>
				<view class="flex-wrap">
					<view v-for="(item, index) in printedStat" :key="index" style="width: 215rpx;margin-bottom: 38rpx;">
						<view class="ele-title">{{item.name}}<text class="ele-basis negative">{{item.amount}}</text>
						</view>
						<view class="ele-value">{{item.pages}}</view>
					</view>
				</view>
			</view>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">设备产量</text>
			</view>
			<div id="bar" style="height:458rpx;padding: 0 30rpx;"></div>
			<view class="bottom-line"></view>
		</view>
	</view>
</template>

<script>
	import {
		GetOrderProductStat,
		GetOrderStat
	} from '../../apis/member';
	import {
		useUserStore
	} from '../../store/user';
	import dayjs from 'dayjs';
	import Big from 'big.js';
	import * as echarts from 'echarts';
	const userData = useUserStore().userData;
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
							increase: '0',
							number: '0'
						}, {
							title: '内部下单',
							increase: '0',
							number: '0'
						}, {
							title: '微信订单',
							increase: '0',
							number: '0'
						}, {
							title: '网站下单',
							increase: '0',
							number: '0'
						}]
					},
					{
						name: '订单金额统计(元)',
						content: [{
							title: '所有订单',
							increase: '0',
							number: '0'
						}, {
							title: '内部下单',
							increase: '0',
							number: '0'
						}, {
							title: '微信订单',
							increase: '0',
							number: '0'
						}, {
							title: '网站下单',
							increase: '0',
							number: '0'
						}]
					}
				],
				productData: [],
				orderRank: [],
				printedStat: [{
						name: '单面',
						amount: '0',
						pages: '0'
					},
					{
						name: '单面版',
						amount: '0',
						pages: '0'
					},
					{
						name: '双面',
						amount: '0',
						pages: '0'
					},
					{
						name: '正面版',
						amount: '0',
						pages: '0'
					},
					{
						name: '左右翻',
						amount: '0',
						pages: '0'
					}
				]
			}
		},
		computed: {
			orderRankAmount() {
				return this.orderRank.reduce((prev, cur) => new Big(prev).plus(cur.orderAmountStat), '0').toString()
			},
			orderRankCount() {
				return this.orderRank.reduce((prev, cur) => new Big(prev).plus(cur.orderCountStat), '0').toString()
			}
		},
		onLoad() {
			this.change(0)
		},
		onReady() {
			this.getPieEcharts()
			this.getLineEcharts()
			this.getBarEcharts()
		},
		methods: {
			change(index) {
				if (index == 0) {
					this.mode = 'date';
					const date = dayjs().format('YYYY-MM-DD');
					this.modeTitle = date;
					this.getOrderStat(date, date)
					this.getOrderProductStat(date, date)
				} else if (index == 1) {
					this.mode = 'year-month';
					this.modeTitle = dayjs().format('YYYY-MM')
					this.getOrderStat(dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format(
						'YYYY-MM-DD'))
					this.getOrderProductStat(dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format(
						'YYYY-MM-DD'))
				} else {
					this.mode = 'year';
					this.modeTitle = dayjs().format('YYYY')
					const year = dayjs().year()
					this.getOrderStat(`${year}-01-01`, `${year}-12-31`)
					this.getOrderProductStat(`${year}-01-01`, `${year}-12-31`)
				}
				this.current = index;
				this.value = Number(new Date())
			},
			changeSource(index) {
				this.currentSource = index;
				this.getPieEcharts()
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
					this.getOrderProductStat(e.range.before, e.range.after)
					return
				}
				const year = dayjs(e.value).year();

				if (e.mode == 'year') {
					this.modeTitle = year
					this.getOrderStat(`${year}-01-01`, `${year}-12-31`)
					this.getOrderProductStat(`${year}-01-01`, `${year}-12-31`)
				} else if (e.mode == 'year-month') {
					const month = dayjs(e.value).month() + 1;
					this.modeTitle = `${year}-${month}`
					this.getOrderStat(dayjs(e.value).startOf('month').format('YYYY-MM-DD'), dayjs(e.value).endOf('month')
						.format('YYYY-MM-DD'))
					this.getOrderProductStat(dayjs(e.value).startOf('month').format('YYYY-MM-DD'), dayjs(e.value).endOf(
							'month')
						.format('YYYY-MM-DD'))
				} else {
					const date = dayjs(e.value).format('YYYY-MM-DD');
					this.modeTitle = date
					this.getOrderStat(date, date)
					this.getOrderProductStat(date, date)
				}
			},
			getOrderStat(beginDate, endDate) {
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

						this.getPieEcharts()
					} else {
						uni.$Utils.showToast(res.message)
					}
				})
			},
			getOrderProductStat(beginDate, endDate) {
				GetOrderProductStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents.map(item => item.mercantileAgentId)
				}).then(res => {
					this.productData = res.data
					this.orderRank = res.data.sort((a, b) => b.orderAmountStat - a.orderAmountStat).slice(0, 3)
					this.getPieEcharts()
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
			getPieEcharts() {
				let myChart = echarts.getInstanceByDom(document.getElementById('pie'));
				if (myChart != null) {
					myChart.dispose();
				}
				myChart = echarts.init(document.getElementById('pie'));

				let sourceData = [];
				let data = [];

				if (this.currentSource == 1) {
					const total = this.productData.reduce((prev, cur) => new Big(prev).plus(cur.orderAmountStat),
						'0').toString()
					sourceData = [{
						number: total
					}, ...this.productData.map(item => ({
						number: item.orderAmountStat,
						title: item.productCategoryName
					}))]
					data = this.productData.map(item => ({
						value: item.orderAmountStat,
						name: item.productCategoryName
					}))
				} else {
					sourceData = this.dataList[1].content.map(item => ({
						...item,
						number: item.number.replace(/,/g, '')
					}));
					data = [{
							value: sourceData[1].number,
							name: '内部下单',
							itemStyle: {
								color: '#3CC3DF'
							}
						},
						{
							value: sourceData[2].number,
							name: '微信订单',
							itemStyle: {
								color: '#6FD195'
							}
						},
						{
							value: sourceData[3].number,
							name: '网站下单',
							itemStyle: {
								color: '#F5C461'
							}
						},
					]
				}

				const option = {
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						icon: 'circle',
						top: 'center',
						left: '35%',
						formatter: function(name) {
							return `${name} ${(sourceData.find(item => item.title == name)?.number / sourceData[0].number * 100 || 0).toFixed(2)}%`;
						}
					},
					series: [{
						name: '订单金额',
						type: 'pie',
						center: ['20%', '50%'],
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
					}]
				};
				myChart.setOption(option);
			},
			getLineEcharts() {
				let myChart = echarts.getInstanceByDom(document.getElementById('line'));
				if (myChart != null) {
					myChart.dispose();
				}
				myChart = echarts.init(document.getElementById('line'));
				const option = {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						icon: 'circle',
						selectedMode: false,
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['09/01', '09/02', '09/03', '09/4', '09/05', '09/06', '09/07']
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: function(value) {
								return `${value/100}万`
							}
						}
					},
					series: [{
							name: '单页',
							type: 'line',
							itemStyle: {
								color: '#8979FF'
							},
							data: [120, 132, 101, 134, 90, 230, 210]
						},
						{
							name: '不干胶',
							type: 'line',
							itemStyle: {
								color: '#6CD2E7'
							},
							data: [220, 182, 191, 234, 290, 330, 310]
						},
						{
							name: '样本画册',
							type: 'line',
							itemStyle: {
								color: '#6FD195'
							},
							data: [150, 232, 201, 154, 190, 330, 410]
						},
						{
							name: '数码单页',
							type: 'line',
							itemStyle: {
								color: '#FF928A'
							},
							data: [320, 332, 301, 334, 390, 330, 320]
						},
						{
							name: '数码画册',
							type: 'line',
							itemStyle: {
								color: '#F5C461'
							},
							data: [820, 932, 901, 934, 1290, 1330, 1320]
						}
					]
				};
				myChart.setOption(option);
			},
			getBarEcharts() {
				let myChart = echarts.getInstanceByDom(document.getElementById('bar'));
				if (myChart != null) {
					myChart.dispose();
				}
				myChart = echarts.init(document.getElementById('bar'));
				const option = {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						icon: 'circle',
						top: '75%',
					},
					grid: {
						top: '15%', // 顶部距离
						left: '15%'
					},
					xAxis: {
						type: 'value',
						position: 'top', // 设置X轴在顶部

					},
					yAxis: {
						type: 'category',
						data: ['5号轮转', '6号理光彩印机'],
						axisTick: {
							show: false // 不显示刻度线
						},
						axisLabel: {
							width: 50,
							overflow: 'break'
						},
					},
					series: [{
							name: '印工',
							type: 'bar',
							itemStyle: {
								color: '#6FD195'
							},
							data: [1820, 2348],
							label: {
								show: true, // 在柱状图上显示数据
								position: 'right' // 数据位置
							}
						},
						{
							name: '版工',
							type: 'bar',
							itemStyle: {
								color: '#3CC3DF'
							},
							data: [1932, 2343],
							label: {
								show: true, // 在柱状图上显示数据
								position: 'right' // 数据位置
							}
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

	.medal-img {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.quantity {
		font-weight: bold;
		font-size: 27rpx;
		color: #6FD195;
		line-height: 34rpx;
	}

	.amount {
		font-weight: bold;
		font-size: 27rpx;
		color: #FF928A;
		line-height: 34rpx
	}

	.total-text {
		font-weight: bold;
		font-size: 27rpx;
		color: #333333;
		line-height: 34rpx;
	}

	.flex-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.printedStat-line {
		border: 2rpx solid #F0F0F0;
		margin: 30rpx 0;
	}

	.printedStat-total {
		font-weight: bold;
		font-size: 31rpx;
		color: #333333;
		line-height: 42rpx;
	}

	.printedStat-content {
		margin: 0 30rpx 61rpx;
		padding: 20rpx;
		background: #FAFAFA;
		border-radius: 15rpx
	}

	.padding-30 {
		padding: 30rpx;
	}
</style>