<template>
    <div id="nav-left">
        <div class="merchant-style global-display global-a-items">
            <img :src="merchantName.avatUrl" alt="">
            <p>{{ merchantName.name }}</p>
        </div>
        <el-menu active-text-color="#409eff" :default-active="menuId" @select="selectActive">
            <div v-for="(item,index) in menuNavData" :key="index">
            <router-link :to="{path:item.router}">
                <el-menu-item :index="item.id">
                    <el-icon :size="20"><component :is="item.icon"></component></el-icon>
                    <span>{{item.title}}</span>
                </el-menu-item>
            </router-link>
            </div>
        </el-menu>
        <div class="exit-login">
            <el-button type="info" @click="exitLogin">退出登录</el-button>
        </div>
    </div>
	<div>
		<audio src="https://diancan-1252107261.cos.accelerate.myqcloud.com/kecheng-chabaidao/mp3/tishi.mp3" ref="audio"></audio>
	</div>
    <router-view></router-view>
</template>

<script setup>
    import { reactive, ref, shallowRef,onMounted } from 'vue'
    import {Star,Position,Pointer,Files,User,DataAnalysis,Setting} from '@element-plus/icons-vue'
    // import Logo from '@/assets/logo.jpg'
    import { useRouter } from 'vue-router'
    import emitter from '@/api/event.js'
	import {soCketObj,socketObj} from '@/api/socket.js'
    const $router = useRouter()  // 这是路由跳转的
    const arrAy = [
        {
            id:'1',
            icon:Star,
            title:'首页推荐',
            router:'index',
            Subclass:[]//是否有二级三级等等菜单
        },
        {
            id:'2',
            icon:Pointer,
            title:'类目管理',
            router:'category',
            Subclass:[]
        },
        {
            id:'3',
            icon:Files,
            title:'商品管理',
            router:'product',
            Subclass:[]
        },
        {
            id:'4',
            icon:User,
            title:'订单管理',
            router:'order',
            Subclass:[]
        },
        {
            id:'5',
            icon:DataAnalysis,
            title:'客服',
            router:'customer',
            Subclass:[]
        },
        {
            id:'6',
            icon:DataAnalysis,
            title:'店铺设置',
            router:'merchant',
            Subclass:[]
        }
    ]
    const menuNavData = shallowRef(arrAy)
    const merchantName = reactive({name:'',avatUrl:''})
	import { ElNotification } from 'element-plus'
    // 菜单激活回调
    function selectActive(index){
        localStorage.setItem('menuid',JSON.stringify(index))
    }
    const menuId = ref('1')
	// 播放音频
	const audio = ref(null)
    onMounted(()=>{
        menuId.value = JSON.parse(localStorage.getItem('menuid'))
        adminInfor()
		//开始连接服务器,接收订单通知
		soCketObj()
		setTimeout(()=>{
			socketObj.value.on('orderinform',(res)=>{
				console.log(res)
				ElNotification({
					type: 'success',
				    title: '订单通知',
				    message: "你有新的订单待处理",
				    position: 'bottom-right',
					duration:5000
				})
				audio.value.play()
			})
		},1000)
    })
    function adminInfor(){
        const {logo,tradeName} = JSON.parse(localStorage.getItem('adminInfor'))
        merchantName.name = tradeName || '未设置'
        merchantName.avatUrl = logo || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
    // 退出登录
    function exitLogin(){
        localStorage.removeItem('adminInfor')
        $router.push('/')
		socketObj.value.close()//关闭连接
    }
    // 修改管理员信息触发
    emitter.on('upload-Admin-Success', () => {
	    adminInfor()
	});
</script>

<style>
#nav-left{
    left: 0;
    top: 0;
    position: fixed;
    height: 100vh;
    background-color: #fff;
    width: 220px;
    z-index: 999;
}
#nav-left span{
    font-size: 18px;
    padding-left: 10px;
}
.merchant-style{
    justify-content: center;
    padding: 40px 0;
	flex-direction: column;
}
.merchant-style img{
    width: 50px;
	height: 50px;
	border-radius: 50%;
	object-fit: cover;
}
.merchant-style p{
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
}
/* 退出登录 */
.exit-login{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 220px;
    text-align: center;
    height: 100px;
    line-height: 100px;
    z-index: 999;
    border-top: 1px solid #f2f2f2;
	background: #ffffff;
}
</style>