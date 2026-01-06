<template>
	<view>
		<uv-sticky bgColor='#FFFFFF'>
			<image v-if="showBanner" :src="$IMG_URL+'/statisticalForm/banner.svg'" mode="" class="banner-img"></image>
			<view class="flex-between padding-lr" :style="{'margin-top': showBanner ? '200rpx' : '0'}">
				<view @click="open" class="mode-title">
					<text style="max-width: 190rpx;">{{modeTitle}}</text>
					<image :src="$IMG_URL+'/statisticalForm/arrow.svg'" class="arrow-img"></image>
				</view>
				<uv-datetime-picker ref="datetimePicker" v-model="value" :mode="mode"
					@confirm="confirm"></uv-datetime-picker>
				<TermPicker :defaultDate='defaultDate' v-model:visable="pickerVisable" @confirm="confirmRange" />
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['日', '月', '年']"
						:current="current" @change="change"></uv-subsection></view>

			</view>
		</uv-sticky>
		<!-- 代理商下拉选择框 -->
		<view class="agent-picker">
			<uv-picker ref="agentPicker" title="代理商选择" :columns="[mercantileAgent]" keyName="name"
				@confirm="confirmAgent" />
			<view @click="openAgentPicker" class="picker-btn">
				<text>代理商：{{ mercantileAgent[currentTab]?.name || '选择代理商' }}</text>
				<image :src="$IMG_URL+'/statisticalForm/arrow.svg'" class="arrow-img"></image>
			</view>
		</view>
		<view v-for="(ele, indx) in dataList" :key="indx">
			<view>
				<view class="flex-between padding-30">
					<text class="section-title flex-1">{{ele.name}}</text>
					<text v-if="ele.lastestUpdateTime"
						style="font-size: 14px;color: gray;">最近更新{{ele.lastestUpdateTime}}</text>
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
				<text class="section-title">营业收入占比</text>
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['支付方式', '产品品类']"
						:current="currentSource" @change="changeSource"></uv-subsection></view>
			</view>
			<view style="height:343rpx;">
				<l-echart ref="pieRef" @finished="getPieEcharts"></l-echart>
			</view>
			<view class="bottom-line"></view>
		</view>
		<view>
			<view class="padding-30">
				<text class="section-title">各品类销售额变化</text>
			</view>
			<view style=" padding: 0 30rpx;">
				<l-echart ref="lineRef" @finished="getLineEcharts"></l-echart>
			</view>
			<view class="bottom-line"></view>
		</view>
		<RankTable title='订单金额排名(产品类)' name='产品' :orderRank='formatRank(productRank)'
			:orderRankCount="rankTotal(productData, 'orderCountStat')"
			:orderRankAmount="rankTotal(productData, 'orderAmountStat')" />
		<RankTable title='订单金额排名(客户)' name='客户' :orderRank='formatRank(companyRank)'
			:orderRankCount="rankTotal(companyData, 'orderCountStat')"
			:orderRankAmount="rankTotal(companyData, 'orderAmountStat')" />
		<RankTable title='订单金额排名(下单人)' name='下单人' :orderRank='formatRank(personRank)'
			:orderRankCount="rankTotal(personTotal, 'orderCountStat')"
			:orderRankAmount="rankTotal(personTotal, 'orderAmountStat')" />
		<view>
			<view class="padding-30">
				<text class="section-title">订单收款、应收款</text>
			</view>
			<view style="padding: 0rpx 30rpx 30rpx"> <uv-subsection style="border-radius: 15rpx;"
					:list="['下单人', '归属人', '设计人']" :current="currentPerson" @change="changePerson"></uv-subsection>
			</view>
			<view style="padding: 0rpx 30rpx; margin-bottom: 61rpx;">
				<scroll-view class="table" :show-scrollbar="true" :scroll-x="true">
					<uni-table>
						<!-- 表头行 -->
						<uni-tr style=" background: #FAFAFA;">
							<uni-th align="left">{{currentPersonName}}</uni-th>
							<uni-th align="right"><text class="quantity">应收</text></uni-th>
							<uni-th align="right"><text class="quantity">已收</text></uni-th>
							<uni-th align="right"><text class="amount">未收</text></uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr v-for="(item, index) in personData" :key="index">
							<uni-td>
								<view>
									{{item.employeeName}}
								</view>
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
				</scroll-view>
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
			<template v-for="(item, index) in capacityData" :key="index">
				<view class="capacity-contain">
					<l-echart :ref='`barRef${index}`' @finished="getBarEcharts(`barRef${index}`, item)"></l-echart>
				</view>
				<view class="capacity-line"></view>
			</template>
		</view>
		<uv-loading-page :loading="loading" loading-text="数据加载中" color="#fff"
			bg-color="rgba(0, 0, 0, 0.3)"></uv-loading-page>
	</view>
</template>

<script>
	import {
		GetMainRevenueStat,
		GetOrderCountStat,
		GetOrderProductStat,
		GetOrderProductTopStat,
		GetOrderProductTrendStat,
		GetOrderStat,
		GetPayModeAmount,
		GetPrintProductionStat,
		GetThingsCapacityStat
	} from '../../apis/member';
	import {
		useUserStore
	} from '../../store/user';
	import dayjs from 'dayjs';
	import Big from 'big.js';
	// #ifdef H5
	import * as echarts from 'echarts';
	// #endif
	// #ifndef H5
	const echarts = require('./static/echarts.min.js')
	// #endif
	import RankTable from './components/rankTable.vue';
	import TermPicker from '@/components/term-picker/term-picker.vue'
	import digit from '@/uni_modules/uv-ui-tools/libs/function/digit.js'

	// const mercantileAgents = useUserStore().userData.mercantileAgents?.map(item => item.mercantileAgentId);
	const tooltipStyle = {
		textStyle: {
			textShadowBlur: 10, // 关键！必须 >0 
			textShadowColor: 'transparent' // 透明覆盖阴影
		},
		backgroundColor: '#ffffff', // 非透明背景
		borderColor: '#000000',
		shadowColor: 'transparent', // 容器阴影透明
		shadowBlur: 0 // 阴影模糊度归零
	}
	export default {
		components: {
			RankTable,
			TermPicker
		},
		data() {
			const date = dayjs();

			return {
				mercantileAgent: [],
				mercantileAgents: [],
				beginDate: null,
				endDate: null,
				currentTab: 0,
				value: Number(new Date()),
				mode: 'date',
				defaultDate: [date.format('YYYY-MM-DD'), date.format('YYYY-MM-DD')],
				modeTitle: date.format('YYYY/MM/DD'),
				current: 0,
				currentSource: 0,
				currentPerson: 0,
				currentPersonName: '下单人',
				productData: [],
				productRank: [],
				companyRank: [],
				companyData: [],
				personRank: [],
				personTotal: [],
				personData: [],
				totalPrintPagesCount: 0,
				totalSuiteCount: 0,
				capacityData: [],
				pickerVisable: false,
				showBanner: true,
				statOrderStatus: 1,
				loading: true,
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
						name: '营业收入统计(元)',
						content: [{
							title: '总收入',
							increase: '0',
							number: '0'
						}, {
							title: '线下支付',
							increase: '0',
							number: '0'
						}, {
							title: '在线支付',
							increase: '0',
							number: '0'
						}, {
							title: '储值支付',
							increase: '0',
							number: '0'
						}, {
							title: '月结支付',
							increase: '0',
							number: '0'
						}]
					},
					{
						name: '收款资金汇总(元)',
						lastestUpdateTime: '',
						content: [{
								title: '总收益',
								increase: '0',
								number: '0'
							}, {
								title: '线下支付',
								increase: '0',
								number: '0'
							}, {
								title: '在线支付',
								increase: '0',
								number: '0'
							},
							{
								title: '储值',
								increase: '0',
								number: '0'
							},
							// {
							// 	title: '扣减预存',
							// 	increase: '0',
							// 	number: '0'
							// }, {
							// 	title: '应收未结',
							// 	increase: '0',
							// 	number: '0'
							// }, 
							{
								title: '应收已结',
								increase: '0',
								number: '0'
							}, {
								title: '一般收入',
								increase: '0',
								number: '0'
							}
						]
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
		onReady() {
			// this.change(0)
			this.mercantileAgent = useUserStore().userData.mercantileAgents
			// 初始化mercantileAgents数组
			this.mercantileAgents = [this.mercantileAgent[this.currentTab].mercantileAgentId]

			this.change(this.currentTab)
		},
		onPageScroll(e) {
			if (e.scrollTop > 0) {
				this.showBanner = false
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#ffffff'
				});
			} else {
				this.showBanner = true
			}
		},
		methods: {
			openAgentPicker() {
				this.$refs.agentPicker.open();
			},
			confirmAgent(e) {
				// 获取选中的代理商索引
				const index = e.indexs[0];
				this.currentTab = index;
				// 根据选中的代理商更新数据
				this.mercantileAgents = [this.mercantileAgent[index].mercantileAgentId];

				// 缓存日期查询
				if (this.beginDate && this.endDate) {
					this.updateData(this.beginDate, this.endDate)
				} else {
					this.change(this.current)
				}
			},
			change(index) {
				if (index == 0) {
					this.mode = 'date';
					const date = dayjs().format('YYYY/MM/DD');
					this.modeTitle = date;
					this.updateData(date, date)
				} else if (index == 1) {
					this.mode = 'year-month';
					this.modeTitle = dayjs().format('YYYY/MM')
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
				if (this.mode == 'date') {
					this.pickerVisable = true
				} else {
					this.$refs.datetimePicker.open();
				}
			},
			confirmRange(date) {
				this.modeTitle = date[0] == date[1] ? date[0] :
					`${dayjs(date[0]).format('YYYY/MM/DD')}-${dayjs(date[1]).format('YYYY/MM/DD')}`
				this.updateData(date[0], date[1])
			},
			confirm(e) {
				if (e.mode == 'year') {
					const year = dayjs(e.value).year();
					this.modeTitle = year
					this.updateData(`${year}-01-01`, `${year}-12-31`)
				} else {
					this.modeTitle = dayjs(e.value).format('YYYY/MM')
					this.updateData(dayjs(e.value).startOf('month').format('YYYY-MM-DD'), dayjs(e.value).endOf('month')
						.format('YYYY-MM-DD'))
				}
			},
			updateData(beginDate, endDate) {
				this.beginDate = beginDate
				this.endDate = endDate
				this.getOrderStat(beginDate, endDate)
				this.getOrderCountStat(beginDate, endDate)
				this.getMainRevenueStat(beginDate, endDate)
				this.getOrderProductStat(beginDate, endDate)
				this.getOrderProductTopStat(beginDate, endDate, 2)
				this.getOrderProductTopStat(beginDate, endDate, 3)
				this.getOrderProductTrendStat(beginDate, endDate)
				this.getPrintProductionStat(beginDate, endDate)
				this.getThingsCapacityStat(beginDate, endDate)
			},
			getOrderCountStat(beginDate, endDate) {
				GetOrderCountStat({
					beginDate,
					endDate,
					mercantileAgents: this.mercantileAgents,
					statOrderStatus: 1
				}).then(res => {
					const curPeriodCount = res.data.curPeriodCount
					const prevPeriodCount = res.data.prevPeriodCount

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
				})
			},
			getMainRevenueStat(beginDate, endDate) {
				GetMainRevenueStat({
					beginDate,
					endDate,
					mercantileAgents: this.mercantileAgents,
					statOrderStatus: 1
				}).then(res => {
					const curPeriodAmount = res.data.curPeriodAmount
					const prevPeriodAmount = res.data.prevPeriodAmount

					this.dataList[1].content[0].number = curPeriodAmount
						.totalRevenue
					this.dataList[1].content[1].number = curPeriodAmount
						.offlinePayedRevenue
					this.dataList[1].content[2].number = curPeriodAmount
						.onlinePayedRevenue
					this.dataList[1].content[3].number = curPeriodAmount
						.balancePayedRevenue
					this.dataList[1].content[4].number = curPeriodAmount
						.billPayedRevenue
					this.dataList[1].content[0].increase = new Big(curPeriodAmount
						.totalRevenue).minus(prevPeriodAmount.totalRevenue).toString()
					this.dataList[1].content[1].increase = new Big(curPeriodAmount
						.offlinePayedRevenue).minus(prevPeriodAmount.offlinePayedRevenue).toString()
					this.dataList[1].content[2].increase = new Big(curPeriodAmount
						.onlinePayedRevenue).minus(prevPeriodAmount.onlinePayedRevenue).toString()
					this.dataList[1].content[3].increase = new Big(curPeriodAmount
						.balancePayedRevenue).minus(prevPeriodAmount.balancePayedRevenue).toString()
					this.dataList[1].content[4].increase = new Big(curPeriodAmount
						.billPayedRevenue).minus(prevPeriodAmount.billPayedRevenue).toString()

					if (this.currentSource == 0) {
						this.getPieEcharts()
					}
				})
			},
			getPayModeAmount(beginDate, endDate, payMode) {
				return GetPayModeAmount({
					beginDate,
					endDate,
					payMode,
					mercantileAgents: this.mercantileAgents
				})
			},
			async getOrderStat(beginDate, endDate) {
				this.loading = true
				try {
					const [orderStatRes, onlinePayRes, cashPayRes] =
					await Promise.all([
						GetOrderStat({
							beginDate,
							endDate,
							mercantileAgents: this.mercantileAgents,
							statOrderStatus: 1
						}),
						this.getPayModeAmount(beginDate,
							endDate, 22),
						this.getPayModeAmount(beginDate,
							endDate, 20)
					])

					const curPeriodAmount = orderStatRes.data.curPeriodAmount
					const prevPeriodAmount = orderStatRes.data.prevPeriodAmount

					const cashPayData = cashPayRes.code === 0 ? cashPayRes.data : {};
					const onlinePayData = onlinePayRes.code === 0 ? onlinePayRes.data : {};
					const cashPayCurPeriodAmount = cashPayData.curPeriodAmount.amount || 0;
					const cashPayPrevPeriodAmount = digit.minus(cashPayCurPeriodAmount, cashPayData.prevPeriodAmount
						.amount || 0);
					const onlinePayCurPeriodAmount = onlinePayData.curPeriodAmount.amount || 0;
					const onlinePayPrevPeriodAmount = digit.minus(onlinePayCurPeriodAmount, onlinePayData
						.prevPeriodAmount.amount || 0);
					this.dataList[2].lastestUpdateTime = curPeriodAmount.lastestUpdateTime
					const {
						storeAmount,
						billPaymentOrderAmount,
						generalIncome
					} = curPeriodAmount

					this.dataList[2].content[0].number = digit.plus(cashPayCurPeriodAmount, onlinePayCurPeriodAmount,
						storeAmount,
						billPaymentOrderAmount, generalIncome)
					this.dataList[2].content[1].number = cashPayCurPeriodAmount
					this.dataList[2].content[2].number = onlinePayCurPeriodAmount
					this.dataList[2].content[3].number = curPeriodAmount
						.storeAmount
					this.dataList[2].content[4].number = curPeriodAmount
						.billPaymentOrderAmount
					this.dataList[2].content[5].number = curPeriodAmount
						.generalIncome

					this.dataList[2].content[1].increase = cashPayPrevPeriodAmount
					this.dataList[2].content[2].increase = onlinePayPrevPeriodAmount

					this.dataList[2].content[3].increase = new Big(curPeriodAmount
						.storeAmount).minus(prevPeriodAmount.storeAmount).toString()
					this.dataList[2].content[4].increase = new Big(curPeriodAmount
						.billPaymentOrderAmount).minus(prevPeriodAmount.billPaymentOrderAmount).toString()
					this.dataList[2].content[5].increase = new Big(curPeriodAmount
						.generalIncome).minus(prevPeriodAmount.generalIncome).toString()
					const [first, ...otherItems] = this.dataList[2].content;
					const allIncreases = otherItems.map(item => item.increase)
					this.dataList[2].content[0].increase = digit.plus(...allIncreases)

					this.loading = false
				} catch (e) {
					console.error(e)
					this.loading = false
				}
			},
			getOrderProductStat(beginDate, endDate) {
				GetOrderProductStat({
					beginDate,
					endDate,
					mercantileAgents: this.mercantileAgents
				}).then(res => {
					this.productData = res.data
					this.productRank = res.data.sort((a, b) => b.orderAmountStat - a.orderAmountStat).slice(0, 3)
					// console.log('total orderAmountStat',digit.plus(...res.data.map(i=>i.orderAmountStat)))
					if (this.currentSource == 1) {
						this.getPieEcharts()
					}
				})
			},
			getOrderProductTopStat(beginDate, endDate, topStatType) {
				GetOrderProductTopStat({
					beginDate,
					endDate,
					mercantileAgents: this.mercantileAgents,
					statDimension: {
						year: 1,
						'year-month': 2,
						date: 3
					} [this.mode],
					topStatType
				}).then(res => {
					if (topStatType == 2) {
						this.companyRank = res.data.slice(0, 10)
						this.companyData = res.data
					} else {
						this.personTotal = res.data
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
					mercantileAgents: this.mercantileAgents,
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
					mercantileAgents: this.mercantileAgents
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
					mercantileAgents: this.mercantileAgents
				}).then(res => {
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
				let otherNumber = 0;

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
					otherNumber = new Big(sourceData[0].number).minus(sourceData.slice(1).reduce((prev, cur) =>
						new Big(prev).plus(cur.number), 0)).toNumber();
					data = [{
							value: sourceData[1].number,
							name: '线下支付',
							itemStyle: {
								color: '#5470c6'
							}
						},
						{
							value: sourceData[2].number,
							name: '在线支付',
							itemStyle: {
								color: '#91cd77'
							}
						},
						{
							value: sourceData[3].number,
							name: '储值支付',
							itemStyle: {
								color: '#ef6567'
							}
						}, {
							value: sourceData[4].number,
							name: '月结支付',
							itemStyle: {
								color: '#f9c956'
							}
						}, {
							value: otherNumber,
							name: '其他',
							itemStyle: {
								color: '#75bedc'
							}
						},
					]
				}

				const option = {
					tooltip: {
						...tooltipStyle,
						trigger: 'item',
						confine: true,
					},
					legend: {
						orient: 'horizontal',
						width: '100%',
						selectedMode: false,
						icon: 'circle',
						itemHeight: 8, // 修改icon图形大小
						textStyle: {
							padding: [0, 0, 0, -10], // 修改文字和图标距离
							rich: {
								a: {
									width: 105,
									backgroundColor: "transparent", // 一定要设置，不然不生效
								},
							},
						},
						top: '61%',
						left: '3%',
						formatter: function(name) {
							return `{a|${name} ${Math.round((sourceData.find(item => item.title == name)?.number || otherNumber) / sourceData[0].number * 100 || 0)}%}`;
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
						...tooltipStyle,
						trigger: 'axis',
						confine: true,
					},
					legend: {
						icon: 'circle',
						itemHeight: 8, // 修改icon图形大小
						itemGap: 20,
						left: '0%',
						textStyle: {
							padding: [0, 0, 0, -10], // 修改文字和图标距离
							rich: {
								a: {
									width: 60,
									backgroundColor: "transparent", // 一定要设置，不然不生效
								},
							},
						},
						formatter: function(name) {
							return `{a|${name}}`
						},
						selectedMode: false,
					},
					grid: {
						top: '40%', // 顶部距离
						left: '0%',
						right: '0%'
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
								return `${Math.round(value/10000)}万`
							}
						}
					},
					series: Object.keys(yCategory).map(key => ({
						name: key,
						type: 'line',
						data: yCategory[key],
						showSymbol: false, // 显示节点

					}))
				};
				chart.setOption(option);
			},
			async getBarEcharts(ref, data) {
				const chart = await this.$refs[ref][0].init(echarts);
				const option = {
					title: {
						text: data.thingName,
						left: 'center'
					},
					tooltip: {
						...tooltipStyle,
						trigger: 'axis',
					},
					legend: {
						icon: 'circle',
						itemHeight: 8, // 修改icon图形大小
						itemGap: 28, // 修改间距
						textStyle: {
							padding: [0, 0, 0, -10], // 修改文字和图标距离
						},
						top: '85%',
						selectedMode: false,
					},
					grid: {
						top: '20%', // 顶部距离
						left: '15%'
					},
					xAxis: {
						type: 'value',
						position: 'top', // 设置X轴在顶部
					},
					yAxis: {
						type: 'category',
						data: data.thingStatusStatList.map(item => item.statusDes),
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
							data: data.thingStatusStatList.map(item => item.pagesCount || null),
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
							data: data.thingStatusStatList.map(item => item.suiteCount || null),
							label: {
								show: true, // 在柱状图上显示数据
								position: 'right', // 数据位置
							}
						}
					]
				};
				chart.setOption(option);
			}
		}
	}
</script>

<style lang="scss">
	.banner-img {
		position: absolute;
		top: -150rpx;
		height: 429rpx;
		width: 100%;
		z-index: -1;
	}

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
		margin-bottom: 61rpx;
		padding-left: 30rpx;
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

	.capacity-contain {
		padding: 0 30rpx;
	}

	.capacity-line:not(:last-child) {
		margin: 0 30rpx 30rpx;
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
		width: 30.53rpx;
		height: 30.53rpx;
		margin: auto 0;
	}

	.table {
		& ::-webkit-scrollbar {
			width: 4rpx !important;
			height: 8rpx !important;
			background-color: #f5f5f5 !important;
			border-top: 2rpx solid #fff;
			display: block;
		}

		& ::-webkit-scrollbar-thumb {
			background: rgba(20, 20, 20, 0.4) !important;
			border-radius: 6rpx !important;
		}

		& ::-webkit-scrollbar-track {
			background-color: #d9e5e5 !important;
		}
	}

	.agent-picker {
		margin: 16rpx 16rpx 0 16rpx;
	}

	.picker-btn {
		display: flex;
		align-items: center;
		padding: 12rpx 24rpx;
		background-color: #f5f5f5;
		border-radius: 20rpx;
		font-size: 28rpx;
		color: #666666;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.picker-btn:active {
		background-color: #e5e5e5;
	}

	.picker-btn .arrow-img {
		margin-left: 8rpx;
		// transform: rotate(90deg);
	}
</style>