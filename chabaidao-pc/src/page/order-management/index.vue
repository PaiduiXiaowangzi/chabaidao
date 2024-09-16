<template>
	<div id="Content-page">
	    <Paging :pagData="[{name:'订单管理',router:''}]" />
	    <div class="content-main">
	        <el-table :data="tableData" style="width: 100%">
	            <el-table-column prop="orderTime" label="交易时间"/>
	            <el-table-column label="订单类型">
					<template #default="{row}">
					    {{ row.orderType == '001' ? '到店取餐' : '外卖到家' }}
					</template>
				</el-table-column>
	            <el-table-column prop="paymentPrice" label="交易金额" />
	            <el-table-column prop="productOrderCount" label="订单数量" />
	            <el-table-column label="操作">
	                <template #default="{row}">
	                    <el-button type="primary" size="default" @click="orderDetails(row._id)">订单详情</el-button>
	                </template>
	            </el-table-column>
	        </el-table>
	    </div>
		<el-pagination class="pager-next" background layout="prev, pager, next" :total="total"
		hide-on-single-page
		@current-change="currentChange"
		/>
	</div>
	<!-- 详细订单展示 -->
	<el-drawer v-model="drawerOrder" :title="drawerTitle" size="40%">
	    <el-table :data="orderData" style="width: 100%">
	        <el-table-column prop="goods_name" label="商品"/>
	        <el-table-column label="规格">
				<template #default="{row}">
				    {{ row.sku.length > 0 ? row.sku.join('/') : '' }}
				</template>
			</el-table-column>
	        <el-table-column prop="goodsQuantity" label="数量" />
	        <el-table-column prop="totalPrice" label="小计" />
	    </el-table>
		<div class="particulars">
			<div class="particulars-flex" v-for="(item,index) in orderInfo" :key="index">
				<p class="orderInfotitle">{{item.way}}</p>
				<div v-if="!Array.isArray(item.details)">{{ item.details }}</div>
				<div  v-else v-for="(item_a,index_a) in item.details" :key="index_a">
					<p>{{item_a.name}}</p>
					<p>{{item_a.mobile}}</p>
					<p>{{item_a.address}}</p>
					<p>{{item_a.detailedAddress}}</p>
				</div>
			</div>
		</div>
	</el-drawer>
</template>

<script setup>
	// 顶部导航组件
	import Paging from '@/page/component/Paging-component.vue'
	import {ref,onMounted} from 'vue'
	import { useRouter } from 'vue-router'
	const $router = useRouter()  // 这是路由跳转的
	import request from '@/api/request.js'
	const tableData = ref([])
	const page = ref(1)
	const total = ref(0)
	onMounted(async()=>{
	    requestApi()
	})
	async function requestApi(){
	    const res = await request.get('/receive-order-list',{page:page.value})
	    console.log(res)
	    tableData.value = res.data.order
	    total.value = res.data.total
	}
	// 分页
	async function currentChange(event){
	    page.value = event
	    requestApi()
	}
	// 详细订单
	const drawerOrder = ref(false)
	const drawerTitle = ref('')
	const orderData = ref([])
	const orderInfo = ref([])
	async function orderDetails(id){
		const res = await request.get('/receive-order-details',{id})
		console.log(res)
		drawerTitle.value = res.data[0].orderType == '001' ? '到店取餐' : '外卖到家'
		orderData.value = res.data[0].productOrder
		if(res.data[0].orderType === '001'){
			orderInfo.value = [
				{
					way:'订单类型',
					details:'到店取餐'
				},
				{
					way:'取餐码',
					details:res.data[0].takeMealCode
				},
				{
					way:'联系电话',
					details:res.data[0].userMobile
				}
			]
		}else{
			orderInfo.value = [
				{
					way:'订单类型',
					details:'外卖到家'
				},
				{
					way:'收货地址',
					details:res.data[0].receiverAddress
				}
			]
		}
		orderInfo.value.push(
			{
				way:'交易金额',
				details:`¥${res.data[0].paymentPrice}`
			},
			{
				way:'下单时间',
				details:res.data[0].orderTime
			},
			{
				way:'订单号',
				details:res.data[0].orderNumber
			}
		)
		drawerOrder.value = true
	}
</script>

<style>
	.particulars{
		background-color: #f8f8f8;
		margin: 10px 0;
		border-radius: 4px;
	}
	.particulars-flex{
		display: flex;
		align-items: center;
		padding: 10px;
	}
	.particulars p{
		font-size: 15px;
	}
	.orderInfotitle{
		font-weight: bold;
		width: 90px;
	}
</style>