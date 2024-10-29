<template>
	<view>
		<uv-sticky bgColor='#FFFFFF'>
			<view class="flex-between">
				<view @click="open" class="mode-title">
					{{modeTitle}}
					<image src="/static/images/statisticalForm/arrow.svg" class="arrow-img"></image>
				</view>
				<uv-datetime-picker ref="datetimePicker" v-model="value" :mode="mode"
					@confirm="confirm"></uv-datetime-picker>
				<!-- <uv-calendars ref="calendars" @confirm="confirm" mode="range" allowSameDay /> -->
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['日', '月', '年']"
						:current="current" @change="change"></uv-subsection></view>
			</view>
		</uv-sticky>
		<view v-for="(ele, indx) in dataList" :key="indx">
			<view>
				<view class="padding-30">
					<text class="section-title">{{ele.name}}</text>
				</view>
				<view class="section-content">
					<view v-for="(item, index) in ele.content" :key="index" class="ele-content">
						<view class="ele-title">{{item.title}}<text
								:class="`${item.increase > 0 ? 'ele-basis positive' : 'ele-basis negative'}`">{{formatNumber(item.increase > 0 ? `+${item.increase}` : item.increase)}}</text>
						</view>
						<view class="ele-value">
							{{formatNumber(item.number)}}
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
			<view style="height:343rpx;">
				<l-echart ref="pieRef" @finished="getPieEcharts"></l-echart>
			</view>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">品类变化趋势</text>
			</view>
			<view style=" padding: 0 30rpx;">
				<l-echart ref="lineRef" @finished="getLineEcharts"></l-echart>
			</view>
			<view class="bottom-line"></view>
		</view>
		<RankTable title='订单金额排名(产品类)' name='产品' :orderRank='formatRank(productRank)'
			:orderRankCount="rankTotal(productRank, 'orderCountStat')"
			:orderRankAmount="rankTotal(productRank, 'orderAmountStat')" />
		<RankTable title='订单金额排名(客户)' name='客户' :orderRank='formatRank(companyRank)'
			:orderRankCount="rankTotal(companyRank, 'orderCountStat')"
			:orderRankAmount="rankTotal(companyRank, 'orderAmountStat')" />
		<RankTable title='订单金额排名(下单人)' name='下单人' :orderRank='formatRank(personRank)'
			:orderRankCount="rankTotal(personRank, 'orderCountStat')"
			:orderRankAmount="rankTotal(personRank, 'orderAmountStat')" />
		<view>
			<view class="padding-30">
				<text class="section-title">订单收款、应收款</text>
			</view>
			<view style="padding: 0rpx 30rpx 30rpx"> <uv-subsection style="border-radius: 15rpx;"
					:list="['下单人', '归属人', '设计人']" :current="currentPerson" @change="changePerson"></uv-subsection>
			</view>
			<view style="padding: 0rpx 30rpx; margin-bottom: 61rpx;">
				<uni-table>
					<!-- 表头行 -->
					<uni-tr style="background: #FAFAFA;">
						<uni-th width="70" align="left">{{currentPersonName}}</uni-th>
						<uni-th width="90" align="right"><text class="quantity">应收</text></uni-th>
						<uni-th width="90" align="right"><text class="quantity">已收</text></uni-th>
						<uni-th width="90" align="right"><text class="amount">未收</text></uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in personData" :key="index">
						<uni-td>
							<uni-tooltip placement="right">
								<text class="index-text line-clamp-name">{{item.employeeName}}</text>
								<template v-slot:content>
									<view style="width: 200rpx;">
										{{item.employeeName}}
									</view>
								</template>
							</uni-tooltip>
						</uni-td>
						<uni-td align="right">{{formatNumber(item.orderAmountStat)}}</uni-td>
						<uni-td align="right">{{formatNumber(item.orderPaiedAmt)}}</uni-td>
						<uni-td align="right">{{formatNumber(item.orderUnpaiedAmt)}}</uni-td>
					</uni-tr>
					<uni-tr style="background: #FAFAFA;">
						<uni-td><text class="total-text">合计</text></uni-td>
						<uni-td align="right"><text
								class="total-text">{{rankTotal(personData, 'orderAmountStat')}}</text></uni-td>
						<uni-td align="right"><text
								class="total-text">{{rankTotal(personData, 'orderPaiedAmt')}}</text></uni-td>
						<uni-td align="right"><text
								class="total-text">{{rankTotal(personData, 'orderUnpaiedAmt')}}</text></uni-td>
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
				<text class="printedStat-total">{{`总印数${totalPrintPagesCount}，总套数${totalSuiteCount}`}}</text>
				<view class="printedStat-line"></view>
				<view class="flex-wrap">
					<view v-for="(item, index) in printedStat" :key="index" class="printed-content">
						<view class="ele-title">{{item.name}}<text
								:class="`${item.increase > 0 ? 'ele-basis positive':'ele-basis negative'}`">{{formatNumber(item.increase > 0 ? `+${item.increase}` : item.increase)}}</text>
						</view>
						<view class="ele-value">{{formatNumber(item.count)}}</view>
					</view>
				</view>
			</view>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">设备产量</text>
			</view>
			<view v-for="(item, index) in capacityData" :key="index" style="padding: 0 30rpx;">
				<l-echart :ref='`bar${index}Ref`' @finished="getBarEcharts(`bar${index}Ref`, item)"></l-echart>
				<view class="capacityStat-line"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		GetOrderProductStat,
		GetOrderProductTopStat,
		GetOrderProductTrendStat,
		GetOrderStat,
		GetPrintProductionStat,
		GetThingsCapacityStat
	} from '../../apis/member';
	import {
		useUserStore
	} from '../../store/user';
	import dayjs from 'dayjs';
	import Big from 'big.js';
	import * as echarts from 'echarts';
	import RankTable from './components/rankTable.vue';
	const userData = useUserStore().userData;
	export default {
		components: {
			RankTable,
		},
		data() {
			return {
				value: Number(new Date()),
				mode: 'date',
				modeTitle: `${dayjs().format('YYYY-MM-DD')}`,
				current: 0,
				currentSource: 0,
				currentPerson: 0,
				currentPersonName: '下单人',
				productData: [],
				productRank: [],
				companyRank: [],
				personRank: [],
				personData: [],
				totalPrintPagesCount: 0,
				totalSuiteCount: 0,
				capacityData: [],
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
				printedStat: [{
						name: '单面',
						increase: '0',
						count: '0'
					},
					{
						name: '单面版',
						increase: '0',
						count: '0'
					},
					{
						name: '双面',
						increase: '0',
						count: '0'
					},
					{
						name: '双面版',
						increase: '0',
						count: '0'
					},
				]
			}
		},
		onLoad() {
			this.change(0)
		},
		methods: {
			change(index) {
				if (index == 0) {
					this.mode = 'date';
					const date = dayjs().format('YYYY-MM-DD');
					this.modeTitle = date;
					this.updateData(date, date)
				} else if (index == 1) {
					this.mode = 'year-month';
					this.modeTitle = dayjs().format('YYYY-MM')
					this.updateData(dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format(
						'YYYY-MM-DD'))
				} else {
					this.mode = 'year';
					this.modeTitle = dayjs().format('YYYY')
					const year = dayjs().year()
					this.updateData(`${year}-01-01`, `${year}-12-31`)
				}
				this.current = index;
				this.value = Number(new Date())
			},
			changeSource(index) {
				this.currentSource = index;
				this.getPieEcharts()
			},
			changePerson(index) {
				this.currentPerson = index;
				this.currentPersonName = {
					0: '下单人',
					1: '归属人',
					2: '设计人'
				} [index]
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
					this.updateData(e.range.before, e.range.after)
					return
				}
				const year = dayjs(e.value).year();

				if (e.mode == 'year') {
					this.modeTitle = year
					this.updateData(`${year}-01-01`, `${year}-12-31`)
				} else if (e.mode == 'year-month') {
					const month = dayjs(e.value).month() + 1;
					this.modeTitle = `${year}-${month}`
					this.updateData(dayjs(e.value).startOf('month').format('YYYY-MM-DD'), dayjs(e.value).endOf('month')
						.format('YYYY-MM-DD'))
				} else {
					const date = dayjs(e.value).format('YYYY-MM-DD');
					this.modeTitle = date
					this.updateData(date, date)
				}
			},
			updateData(beginDate, endDate) {
				this.getOrderStat(beginDate, endDate)
				this.getOrderProductStat(beginDate, endDate)
				this.getOrderProductTopStat(beginDate, endDate, 2)
				this.getOrderProductTopStat(beginDate, endDate, 3)
				this.getOrderProductTrendStat(beginDate, endDate)
				this.getPrintProductionStat(beginDate, endDate)
				this.getThingsCapacityStat(beginDate, endDate)
			},
			getOrderStat(beginDate, endDate) {
				GetOrderStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents?.map(item => item.mercantileAgentId)
				}).then(res => {
					if (res.code !== 0) {
						uni.$Utils.showToast(res.message)
						return
					}
					const curPeriodCount = res.data.curPeriodCount
					const prevPeriodCount = res.data.prevPeriodCount
					const curPeriodAmount = res.data.curPeriodAmount
					const prevPeriodAmount = res.data.prevPeriodAmount

					this.dataList[0].content[0].number = curPeriodCount.orderCount
					this.dataList[0].content[1].number = curPeriodCount
						.innerOrderCount
					this.dataList[0].content[2].number = curPeriodCount
						.weChatOrderCount
					this.dataList[0].content[3].number = curPeriodCount
						.shoppingOrderCount
					this.dataList[0].content[0].increase = curPeriodCount
						.orderCount - prevPeriodCount.orderCount
					this.dataList[0].content[1].increase = curPeriodCount
						.innerOrderCount - prevPeriodCount.innerOrderCount
					this.dataList[0].content[2].increase = curPeriodCount
						.weChatOrderCount - prevPeriodCount.weChatOrderCount
					this.dataList[0].content[3].increase = curPeriodCount
						.shoppingOrderCount - prevPeriodCount.shoppingOrderCount


					this.dataList[1].content[0].number = curPeriodAmount
						.orderAmount
					this.dataList[1].content[1].number = curPeriodAmount
						.innerOrderAmount
					this.dataList[1].content[2].number = curPeriodAmount
						.weChatOrderAmount
					this.dataList[1].content[3].number = curPeriodAmount
						.shoppingOrderAmount
					this.dataList[1].content[0].increase = new Big(curPeriodAmount
						.orderAmount).minus(prevPeriodAmount.orderAmount).toString()
					this.dataList[1].content[1].increase = new Big(curPeriodAmount
						.innerOrderAmount).minus(prevPeriodAmount.innerOrderAmount).toString()
					this.dataList[1].content[2].increase = new Big(curPeriodAmount
						.weChatOrderAmount).minus(prevPeriodAmount.weChatOrderAmount).toString()
					this.dataList[1].content[3].increase = new Big(curPeriodAmount
						.shoppingOrderAmount).minus(prevPeriodAmount.shoppingOrderAmount).toString()

					if (this.currentSource == 0) {
						this.getPieEcharts()
					}
				})
			},
			getOrderProductStat(beginDate, endDate) {
				GetOrderProductStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents?.map(item => item.mercantileAgentId)
				}).then(res => {
					this.productData = res.data
					this.productRank = res.data.sort((a, b) => b.orderAmountStat - a.orderAmountStat).slice(0, 3)
					if (this.currentSource == 1) {
						this.getPieEcharts()
					}
				})
			},
			getOrderProductTopStat(beginDate, endDate, topStatType) {
				GetOrderProductTopStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents?.map(item => item.mercantileAgentId),
					statDimension: {
						year: 1,
						'year-month': 2,
						date: 3
					} [this.mode],
					topStatType
				}).then(res => {
					if (topStatType == 2) {
						this.companyRank = res.data.slice(0, 10)
					} else {
						this.personRank = res.data.slice(0, 5)
						this.personData = res.data.slice(0, 10).map(item => ({
							...item,
							orderUnpaiedAmt: new Big(item.orderAmountStat).minus(item.orderPaiedAmt)
								.toString()
						}))
					}
				})
			},
			getOrderProductTrendStat(beginDate, endDate) {
				GetOrderProductTrendStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents?.map(item => item.mercantileAgentId),
					statDimension: {
						year: 1,
						'year-month': 2,
						date: 3
					} [this.mode],
				}).then(res => {
					res.data.sort((a, b) => new Date(a.timeDimension) - new Date(b.timeDimension))
					const xTime = res.data.reduce((groupArr, cur) => {
						const time = cur['timeDimension']

						if (!groupArr.includes(time)) {
							groupArr.push(time)
						}

						return groupArr
					}, [])
					const category = res.data.reduce((groupObj, cur) => {
						const groupKey = cur['productCategoryName']

						if (!groupObj[groupKey]) {
							groupObj[groupKey] = []
						}
						groupObj[groupKey].push(cur)

						return groupObj
					}, {})
					let yCategory = {}
					Object.keys(category).forEach(key => {
						yCategory[key] = xTime.map(time => {
							const curData = category[key].find(item => item.timeDimension == time)

							return curData ? curData.orderAmountStat : 0
						})
					})
					this.getLineEcharts(xTime, yCategory)
				})
			},
			getPrintProductionStat(beginDate, endDate) {
				GetPrintProductionStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents?.map(item => item.mercantileAgentId),
				}).then(res => {
					this.totalPrintPagesCount = res.data.totalPrintPagesCount
					this.totalSuiteCount = res.data.totalSuiteCount
					this.printedStat[0].count = res.data.curPeriodCount.singlePagesCount
					this.printedStat[0].increase = new Big(res.data.curPeriodCount.singlePagesCount).minus(res.data
						.prevPeriodCount.singlePagesCount).toString()
					this.printedStat[1].count = res.data.curPeriodCount.singleSuiteCount
					this.printedStat[1].increase = new Big(res.data.curPeriodCount.singleSuiteCount).minus(res.data
						.prevPeriodCount.singleSuiteCount).toString()
					this.printedStat[2].count = res.data.curPeriodCount.doublePagesCount
					this.printedStat[2].increase = new Big(res.data.curPeriodCount.doublePagesCount).minus(res.data
						.prevPeriodCount.doublePagesCount).toString()
					this.printedStat[3].count = res.data.curPeriodCount.doubleSuiteCount
					this.printedStat[3].increase = new Big(res.data.curPeriodCount.doubleSuiteCount).minus(res.data
						.prevPeriodCount.doubleSuiteCount).toString()
				})
			},
			getThingsCapacityStat(beginDate, endDate) {
				GetThingsCapacityStat({
					beginDate,
					endDate,
					mercantileAgents: userData.mercantileAgents?.map(item => item.mercantileAgentId),
				}).then(res => {
					console.log(111, res.data)
					this.capacityData = res.data
				})
			},
			formatRank(data) {
				return data.map(item => ({
					...item,
					orderCountStat: this.formatNumber(item.orderCountStat),
					orderAmountStat: this.formatNumber(item.orderAmountStat)
				}))
			},
			rankTotal(data, key) {
				return this.formatNumber(data.reduce((prev, cur) => new Big(prev).plus(cur[key]), '0').toString())
			},
			formatNumber(num) {
				// 将数字转换为字符串
				const numStr = num.toString();

				// 使用正则表达式添加千分符
				const [integerPart, decimalPart] = numStr.split('.');
				const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

				return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
			},
			async getPieEcharts() {
				const chart = await this.$refs.pieRef.init(echarts);
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
					sourceData = this.dataList[1].content;
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
						trigger: 'item',
						confine: true
					},
					legend: {
						orient: 'vertical',
						height: '30%',
						selectedMode: false,
						icon: 'circle',
						itemHeight: 8, // 修改icon图形大小
						itemGap: 8, // 修改间距
						textStyle: {
							padding: [0, 0, 0, -10], // 修改文字和图标距离
						},
						top: 'bottom',
						formatter: function(name) {
							return `${name} ${(sourceData.find(item => item.title == name)?.number / sourceData[0].number * 100 || 0).toFixed(0)}%`;
						}
					},
					series: [{
						name: '订单金额',
						type: 'pie',
						center: ['50%', '30%'],
						radius: ['35%', '60%'],
						label: {
							show: false,
							position: 'center'
						},
						emphasis: {
							disabled: true
						},
						data
					}]
				};
				chart.setOption(option)
			},
			async getLineEcharts(xTime = [], yCategory = {}) {
				const chart = await this.$refs.lineRef.init(echarts);
				const option = {
					tooltip: {
						trigger: 'axis',
						confine: true
					},
					legend: {
						icon: 'circle',
						itemHeight: 8, // 修改icon图形大小
						itemGap: 8, // 修改间距
						textStyle: {
							padding: [0, 0, 0, -10], // 修改文字和图标距离
						},
						selectedMode: false,
					},
					grid: {
						top: '25%', // 顶部距离
						left: '17%'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						axisLabel: {
							rotate: 25, // 设置倾斜角度为25度
						},
						data: xTime
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: function(value) {
								return `${(value/10000).toFixed(0)}万`
							}
						}
					},
					series: Object.keys(yCategory).map(key => ({
						name: key,
						type: 'line',
						data: yCategory[key],
						showSymbol: false // 显示节点
					}))
				};
				chart.setOption(option);
			},
			async getBarEcharts(ref, data) {
				const chart = await this.$refs.ref.init(echarts);
				const option = {
					title: {
						text: data.thingName,
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						icon: 'circle',
						itemHeight: 8, // 修改icon图形大小
						itemGap: 8, // 修改间距
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
						data: data.thingStatusStatList.map(item => ({
							4: '待打印',
							6: '已上机',
							10: '已打印',
							30: '已取消'
						} [item.status])),
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
							data: data.thingStatusStatList.map(item => item.pagesCount),
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
							data: data.thingStatusStatList.map(item => item.suiteCount),
							label: {
								show: true, // 在柱状图上显示数据
								position: 'right' // 数据位置
							}
						}
					]
				};
				chart.setOption(option);
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

	.index-text {
		font-weight: bold;
		font-size: 23rpx;
		color: #808080;
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

	.capacityStat-line {
		border: 2rpx solid #EDEEF0;
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

	.printed-content {
		width: 190rpx;
		margin-bottom: 38rpx;
		padding: 8rpx
	}

	.printed-content:not(:nth-child(3)):not(:nth-child(4)) {
		border-right: 2rpx solid #F0F0F0;
	}

	.padding-30 {
		padding: 30rpx;
	}

	.line-clamp-name {
		height: 35rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.arrow-img {
		max-width: 30.53rpx;
		max-height: 30.53rpx;
		margin: auto;
	}
</style>