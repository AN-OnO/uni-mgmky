// 设置白名单，白名单中的路径不进行拦截
const whitePage = ['/',
	'/pages/index/login', '/pages/tabbar/index',
]

// 检查白名单
function checkWhite(url) {
	if (!url) return true
	const path = url.split('?')[0]
	return whitePage.includes(path)
}

// 要拦截的跳转方式
let arr = ["navigateTo", "switchTab", "redirectTo", "reLaunch"];
arr.forEach(value => {
	uni.addInterceptor(value, {
		invoke(e) {
			const isLogin = uni.$Utils.getStorage('token')
			if (checkWhite(e.url) || isLogin) {
				return true
			} else {
				console.warn(e.url, '白名单检测未通过')
				uni.showModal({
					title: '提示',
					content: '此功能需要登录后才能体验',
					success(res) {
						res.confirm && uni.navigateTo({
							url: '/pages/index/login',
							animationType: 'pop-in',
							animationDuration: 300
						})
					}
				})
				return false
			}
		},
		fail(err) {
			console.warn('addInterceptor fail:', err);
		},
	})
})