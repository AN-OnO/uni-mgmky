<template>
	<view class="bind-container">
		<uv-search bgColor="#F3F3F3" margin="0 30rpx 25rpx" v-model="keyWords" :showAction='false' @search='getList'
			placeholder="搜索工艺名称"></uv-search>
		<template v-for="(item, index) in technologies" :key="index">
			<view class="content">
				<image class="icon" :src="item.photo"></image>
				<text class="name">{{item.name}}</text>
				<text class="flex-1">已选：{{item.thingBindTypeDesc === '设置默认设备' ? item.thingName : item.thingBindTypeDesc}}</text>
				<text :class="['down-arrow', selectedId === item.technologyId ? 'up-arrow' : '']" @click="selectTechnology(item)"></text>
			</view>
			<view v-if="selectedId === item.technologyId" class="selected">
				<view class="flex-row flex-between">
					<button :class="['btn', selectedBtn === 'default' ? 'active' : '']" @click="selectedType('default')">设置默认设备</button>
					<button :class="['btn', selectedBtn === 'manual' ? 'active' : '']" @click="selectedType('manual')">每次手工选择</button>
				</view>
				<uv-radio-group v-if="selectedBtn === 'default'" v-model="radiovalue" activeColor="#469DCD" placement="column" iconPlacement="right" @change="changeRadio">
					<uv-radio v-for="(item, index) in radiolist" :key="index" :label="item.thingName"
						:name="item.thingId" customStyle="padding: 32rpx 30rpx">
					</uv-radio>
				</uv-radio-group>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		ListMyProductionBindThings,
		ListTechnologyBindThings,
		SaveMyTechnologyBindThings
	} from '../../apis/member';

	export default {
		data() {
			return {
				keyWords: '',
				technologies: [],
				selectedId: '',
				selectedBtn: '',
				radiolist: [],
				radiovalue: '',
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			selectedType(type) {
				this.selectedBtn = type
				
				let thingBindType
				let thingId
				if (type === 'manual') {
					thingBindType = 2
					thingId = null
				} else {
					thingBindType = this.radiovalue ? 1 : 0,
					thingId = this.radiovalue ? this.radiovalue : null
				}
				
				SaveMyTechnologyBindThings({
					technologyId: this.selectedId,
					thingBindType,
					thingId
				}).then(res => {
					uni.$uv.toast('设置成功')
					this.getList()
				})
			},
			getList() {
				ListMyProductionBindThings({
					keyWord: this.keyWords
				}).then(res => {
					this.technologies = res.data.technologies.sort((a, b) => a.code > b.code ? 1 : -1)
				})
			},
			selectTechnology(technologyInfo) {
				if (this.selectedId === technologyInfo.technologyId) {
					this.selectedId = ''
					return
				}
				
				ListTechnologyBindThings({
					technologyId: technologyInfo.technologyId
				}).then(res => {
					this.selectedId = technologyInfo.technologyId
					this.radiolist = [{
						thingName: '排产自动分配设备',
						thingId: ''
					}].concat(res.data)
					this.radiovalue = technologyInfo.thingId ? technologyInfo.thingId : ''
					this.selectedBtn = technologyInfo.thingBindType === 2 ? 'manual' : 'default'
				})
			},
			changeRadio(thingId) {				
				SaveMyTechnologyBindThings({
					technologyId: this.selectedId,
					thingBindType: thingId ? 1 : 0,
					thingId: thingId ? thingId : null
				}).then(res => {
					uni.$uv.toast('设置成功')
					this.getList()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 46rpx 30rpx;
		border-bottom: 2rpx solid #E5E6EB;
		;
		display: flex;
		align-items: center;

		.icon {
			width: 46rpx;
			height: 46rpx;
			margin-right: 15rpx;
		}

		.name {
			width: 200rpx;
			font-weight: 500;
			font-size: 31rpx;
			color: #469DCD;
			line-height: 46rpx;
		}

		.down-arrow {
			display: inline-block;
			margin-left: 15rpx;
			margin-bottom: 8rpx;
			width: 16rpx;
			height: 16rpx;
			border-left: 1px solid #808080;
			border-bottom: 1px solid #808080;
			transform: rotate(-45deg)
		}
		
		.up-arrow {
			transform: rotate(135deg)
		}
	}



	.selected {
		background: #F7F8FA;

		.btn {
			width: 322rpx;
			height: 76rpx;
			margin-top: 15rpx;
			margin-bottom: 48rpx;
			background: #FFFFFF;
			border-radius: 15rpx;
			border: 2rpx solid #469DCD;
			font-weight: 500;
			font-size: 31rpx;
			color: #469DCD;
			line-height: 42rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.active {
			color: rgba(255,255,255,0.9);
			background: #469DCD;
		}
	}
</style>