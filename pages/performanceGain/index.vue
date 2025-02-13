<template>
	<view>
		<uv-sticky bgColor='#FFFFFF'>
			<image v-if="showBanner" src="/static/images/gain/绩效收益banner.png" mode="" class="banner-img"></image>
			<view class="flex-row align-center justify-between padding-lr"
				:style="{'margin-top': showBanner ? '200rpx' : '0'}">
				<view @click="open" class="mode-title">
					{{modeTitle}}
					<image :src="$IMG_URL+'/statisticalForm/arrow.svg'" class="arrow-img"></image>
				</view>
				<uv-datetime-picker ref="datetimePicker" v-model="value" :mode="mode"
					@confirm="confirm"></uv-datetime-picker>
				<term-picker :defaultDate='defaultDate' v-model:visable="pickerVisable" @confirm="confirmRange" />
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['日', '月', '年']"
						:current="current" @change="change"></uv-subsection></view>
			</view>
		</uv-sticky>
		<view>
			<view class="flex-row align-center justify-between padding">
				<text class="section-title">员工绩效排名</text>
				<view class="sub-section"><uv-subsection style="border-radius: 15rpx;" :list="['前台', '后道']"
						:current="currentSource" @change="changeSource"></uv-subsection></view>
			</view>
			<view class="padding-lr">
				<uni-table>
					<template v-if="selfData">
						<uni-tr>
							<uni-td align="center">
								<image v-if="selfData.index < 3"
									:src="$IMG_URL+ (selfData.index == 0 ? '/statisticalForm/gold.svg' : selfData.index == 1 ? '/statisticalForm/silver.svg': '/statisticalForm/bronze.svg')"
									class='medal-img'></image>
								<text class="index-text" v-else>{{selfData.index + 1}}</text>
							</uni-td>
							<uni-td align="left">{{selfData.employeeName}}</uni-td>
							<uni-td align="right">{{formatNumber(selfData.completedOrderCount)}}</uni-td>
							<uni-td align="right">{{formatNumber(selfData.totalAmount)}}</uni-td>
							<uni-td align="right"></uni-td>
						</uni-tr>
						<uni-tr></uni-tr>
					</template>
					<!-- 表头行 -->
					<uni-tr style="background: #F5F6F8;">
						<uni-th width="80rpx" align="left"><text class="table-head">排名</text></uni-th>
						<uni-th width="130rpx" align="left"><text class="table-head">员工姓名</text></uni-th>
						<uni-th width="145rpx" align="right"><text class="table-head">完成数量</text></uni-th>
						<uni-th width="155rpx" align="right"><text class="table-head">总收益</text></uni-th>
						<uni-th width="80rpx" align="right"><text class="table-head">详情</text></uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in renderRank" :key="index" @tap="goDetail(item.employeeId)">
						<uni-td align="center">
							<image v-if="index < 3"
								:src="$IMG_URL+ (index == 0 ? '/statisticalForm/gold.svg' : index == 1 ? '/statisticalForm/silver.svg': '/statisticalForm/bronze.svg')"
								class='medal-img'></image>
							<text class="index-text" v-else>{{index + 1}}</text>
						</uni-td>
						<uni-td>
							{{item.employeeName}}
						</uni-td>
						<uni-td align="right">{{formatNumber(item.completedOrderCount)}}</uni-td>
						<uni-td align="right">{{formatNumber(item.totalAmount)}}</uni-td>
						<uni-td align="right">
							<view class="flex-row justify-end">
								<uv-icon name="arrow-right"></uv-icon>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="margin-top-sm flex-row justify-center">
					<uv-icon v-if="performanceRank.length > 10" @click="showMore = !showMore"
						:name="showMore ? 'arrow-down' : 'arrow-up'" :label="showMore ? '查看更多' : '收起'"
						labelPos="left"></uv-icon>
				</view>
			</view>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import TermPicker from '@/components/term-picker/term-picker.vue'
	import {
		GetPerformanceRank
	} from '../../apis/member';
	export default {
		data() {
			const date = dayjs();

			return {
				value: Number(new Date()),
				mode: 'date',
				showBanner: true,
				showMore: true,
				pickerVisable: false,
				current: 0,
				currentSource: 0,
				beginDate: '',
				endDate: '',
				modeTitle: date.format('YYYY/MM/DD'),
				defaultDate: [date.format('YYYY-MM-DD'), date.format('YYYY-MM-DD')],
				performanceRank: []
			}
		},
		onLoad() {
			this.change(0)
		},
		onPageScroll(e) {
			if (e.scrollTop > 0) {
				this.showBanner = false
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#ffffff'
				});
			}
		},
		computed: {
			renderRank() {
				return this.showMore ? this.performanceRank.slice(0, 10) : this.performanceRank
			},
			selfData() {
				const userData = uni.getStorageSync('user')
				const index = this.performanceRank.findIndex((item) => item.employeeId == userData.userId)
				
				return index > 0 ? {...this.performanceRank[index], index} : null
			}
		},
		methods: {
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
			open() {
				if (this.mode == 'date') {
					this.pickerVisable = true
				} else {
					this.$refs.datetimePicker.open();
				}
			},
			confirmRange(date) {
				this.modeTitle = date[0] == date[1] ? dayjs(date[0]).format('YYYY/MM/DD') :
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
			changeSource(index) {
				this.currentSource = index;

				const currentTime = this.modeTitle
				if (this.mode == 'year') {
					this.updateData(`${currentTime}-01-01`, `${currentTime}-12-31`)
				} else if (this.mode == 'year-month') {
					this.updateData(dayjs(currentTime).startOf('month').format('YYYY-MM-DD'), dayjs(currentTime).endOf(
							'month')
						.format('YYYY-MM-DD'))
				} else {
					const date = currentTime.split('-')
					this.updateData(date[0], date[1] || date[0])
				}
			},
			updateData(beginDate, endDate) {
				GetPerformanceRank({
					beginDate,
					endDate,
					positionType: this.currentSource + 1
				}).then(res => {
					this.performanceRank = res.data
					this.beginDate = beginDate
					this.endDate = endDate
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
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/performanceGain/detail?employeeId=${id}&beginDate=${this.beginDate}&endDate=${this.endDate}&current=${this.current}&positionType=${this.currentSource + 1}`
				})
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

	.mode-title {
		display: flex;
		font-weight: 500;
		font-size: 31rpx;
		color: #333333;
		line-height: 46rpx;
	}

	.arrow-img {
		max-width: 30.53rpx;
		max-height: 30.53rpx;
		margin: auto;
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

	::v-deep .uni-table-tr:first-child {
		background: linear-gradient(100deg, #D2E6FF 0%, #F8FBFF 100%);

		.uni-table-td:first-child {
			border-radius: 15rpx 0 0 15rpx;
			font-weight: 600;
			font-size: 27rpx;
			color: #333333;
			line-height: 34rpx;
		}

		.uni-table-td:last-child {
			border-radius: 0 15rpx 15rpx 0;
		}
	}

	::v-deep .uni-table-tr:nth-child(2) {
		height: 30rpx;
	}

	.table-head {
		font-weight: bold;
		font-size: 27rpx;
		color: #333333;
		line-height: 34rpx;
	}

	.medal-img {
		max-width: 45.8rpx;
		max-height: 45.8rpx;
	}

	.index-text {
		font-weight: bold;
		font-size: 23rpx;
		color: #333333;
		line-height: 34rpx;
	}
</style>