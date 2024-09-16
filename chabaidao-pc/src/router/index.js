import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
	{//登录界面
		path: '/',
		name: 'login',
		component: () => import('@/page/login/login.vue')
	},
	{
		path: '/index',
		name: 'index',
		component: () => import('@/page/index/index.vue'),
		redirect: '/home',
		// 二级路由
		children: [
			{//首页商品推荐
				path: '/home',
				name: 'home',
				component: () => import('@/page/home-recdation/index.vue')
			},
			{//新增首页商品推荐
				path: '/NewRecommendation',
				name: 'NewRecommendation',
				component: () => import('@/page/home-recdation/NewRecommendation.vue')
			},
			{//类目管理
				path: '/category',
				name: 'category',
				component: () => import('@/page/category-management/index.vue')
			},
			{//商品管理
				path: '/product',
				name: 'product',
				component: () => import('@/page/product-management/index.vue')
			},
			{//新增商品
				path: '/new-goods',
				name: 'new-goods',
				component: () => import('@/page/product-management/new-goods.vue')
			},
			{//订单管理
				path: '/order',
				name: 'order',
				component: () => import('@/page/order-management/index.vue')
			},
			{//客服
				path: '/customer',
				name: 'customer',
				component: () => import('@/page/customer-service/index.vue')
			},
			{//商家设置
				path: '/merchant',
				name: 'merchant',
				component: () => import('@/page/merchant-settings/index.vue')
			}
		]
	}
]

const router = createRouter({
	// 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes
})

export default router