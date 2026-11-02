/** 接口未就绪前的查单示例。字段与 docs/order-lookup-contract.md 对齐。 */
export const ORDER_STATUSES = {
	producing: {
		code: 'producing',
		desc: '生产中',
		tone: 'red'
	},
	pending_delivery: {
		code: 'pending_delivery',
		desc: '待配送',
		tone: 'ink'
	},
	delivered: {
		code: 'delivered',
		desc: '已完成',
		tone: 'green'
	}
}

export const mockOrders = [{
	orderItemNo: '24101500018801',
	saleOrderNo: '241015000188',
	companyName: '永昌广告印务',
	contactName: '周敏',
	contactMobile: '13855120018',
	productName: 'A4 宣传单 铜版纸 157g',
	spec: '210×297mm / 双面四色 / 覆哑膜',
	quantity: 5000,
	unit: '张',
	amount: 1860,
	status: 'producing',
	statusDesc: '生产中',
	currentTechnologyName: '印刷',
	checkintime: '2026-10-15 09:26',
	deliveryMethodDesc: '店内配送',
	deliveryAddress: '合肥市包河区汝河路 88 号',
	remark: '封面色值跟上次样张，不要偏红。',
	technologies: [{
		name: '印前',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '李工',
		finishedAt: '2026-10-15 08:40'
	}, {
		name: '印刷',
		status: 'doing',
		statusDesc: '进行中',
		operatorName: '王工',
		finishedAt: ''
	}, {
		name: '后道',
		status: 'wait',
		statusDesc: '未开始',
		operatorName: '',
		finishedAt: ''
	}]
}, {
	orderItemNo: '24101200007302',
	saleOrderNo: '241012000073',
	companyName: '汝河路图文',
	contactName: '陈磊',
	contactMobile: '13955126673',
	productName: '不干胶标签 卷装',
	spec: '50×30mm / 亮膜 / 模切',
	quantity: 20000,
	unit: '枚',
	amount: 960,
	status: 'pending_delivery',
	statusDesc: '待配送',
	currentTechnologyName: '打包',
	checkintime: '2026-10-12 16:08',
	deliveryMethodDesc: '店内配送',
	deliveryAddress: '合肥市蜀山区长江西路 266 号',
	remark: '',
	technologies: [{
		name: '印刷',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '赵工',
		finishedAt: '2026-10-13 11:20'
	}, {
		name: '模切',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '赵工',
		finishedAt: '2026-10-14 15:02'
	}, {
		name: '打包',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '孙工',
		finishedAt: '2026-10-15 10:18'
	}]
}, {
	orderItemNo: '24100800002101',
	saleOrderNo: '241008000021',
	companyName: '合肥市图书馆',
	contactName: '何倩',
	contactMobile: '13755120921',
	productName: '阅读书签 特种纸',
	spec: '148×50mm / 单面 / 圆角',
	quantity: 3000,
	unit: '张',
	amount: 720,
	status: 'delivered',
	statusDesc: '已完成',
	currentTechnologyName: '配送',
	checkintime: '2026-10-08 11:42',
	deliveryMethodDesc: '客户自提',
	deliveryAddress: '合肥市庐阳区阜南路 78 号',
	remark: '已自提，签收人何倩。',
	technologies: [{
		name: '印刷',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '李工',
		finishedAt: '2026-10-09 09:10'
	}, {
		name: '模切',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '李工',
		finishedAt: '2026-10-09 14:36'
	}, {
		name: '配送',
		status: 'done',
		statusDesc: '已完成',
		operatorName: '客户自提',
		finishedAt: '2026-10-10 16:05'
	}]
}]

export function findOrders(keyword) {
	const query = String(keyword || '').trim().toLowerCase()
	if (!query) return []
	return mockOrders.filter((order) => {
		const fields = [
			order.saleOrderNo,
			order.orderItemNo,
			order.companyName,
			order.productName,
			order.contactName,
			order.contactMobile,
			order.currentTechnologyName
		]
		return fields.some((field) => String(field).toLowerCase().includes(query))
	})
}

export function findOrder(orderItemNo) {
	return mockOrders.find((order) => order.orderItemNo === orderItemNo) || null
}
