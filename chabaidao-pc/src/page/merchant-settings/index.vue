<template>
    <div id="Content-page">
        <Paging :pagData="[{name:'基础信息',router:''}]" />
        <div class="content-main">
            <div class="global-display global-a-items">
                <p class="setting-name">店铺logo</p>
                <div class="global-display global-a-items global-j-content setting-flex">
                    <img :src="adminInfo.logo" alt="">
                    <p @click="logoShow = true">修改</p>
                </div>
            </div>
            <div class="global-display global-a-items">
                <p class="setting-name">店铺名称</p>
                <div class="global-display global-a-items global-j-content setting-flex">
                    <p>{{ adminInfo.tradeName }}</p>
                    <p @click="nameShow = true">修改</p>
                </div>
            </div>
            <div class="global-display global-a-items">
                <p class="setting-name">店铺介绍</p>
                <div class="global-display global-a-items global-j-content setting-flex">
                    <p>{{ adminInfo.shopIntroduction }}</p>
                    <p @click="introduceShow = true">修改</p>
                </div>
            </div>
            <div class="global-display global-a-items">
                <p class="setting-name">营业时间</p>
                <div class="global-display global-a-items global-j-content setting-flex">
                    <p>{{ adminInfo.businessHours }}</p>
                    <p @click="businessShow = true">修改</p>
                </div>
            </div>
			<div class="global-display global-a-items">
			    <p class="setting-name">外卖起送价(元)</p>
			    <div class="global-display global-a-items global-j-content setting-flex">
			        <p>{{adminInfo.initialPrice}}</p>
			        <p @click="minimumOrderAmountShow = true">修改</p>
			    </div>
			</div>
            <div class="global-display global-a-items">
                <p class="setting-name">店铺地址</p>
                <div class="global-display global-a-items global-j-content setting-flex">
                    <p>{{ adminInfo.address }}</p>
                    <p @click="settingAddress">修改</p>
                </div>
            </div>
        </div>
    </div>
    <!-- 修改弹出框 -->
    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-model="logoShow"
        title="修改头像"
        width="30%"
        align-center>
        <UploadImg width="100px"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button size="default" @click="logoShow = false">取消</el-button>
            <el-button size="default" type="primary" @click="okImage">提交</el-button>
        </span>
        </template>
    </el-dialog>
    <!-- 修改店铺名称弹出框 -->
    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-model="nameShow"
        title="修改店铺名称"
        width="30%"
        align-center>
        <el-input placeholder="请设置新的店铺名称" v-model="tradeName" />
        <template #footer>
        <span class="dialog-footer">
            <el-button size="default" @click="nameShow = false">取消</el-button>
            <el-button size="default" type="primary" @click="okName">提交</el-button>
        </span>
        </template>
    </el-dialog>
    <!-- 修改店铺介绍弹出框 -->
    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-model="introduceShow"
        title="修改店铺介绍"
        width="30%"
        align-center>
        <el-input placeholder="请输入店铺介绍" v-model="shopIntroduction"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button size="default" @click="introduceShow = false">取消</el-button>
            <el-button size="default" type="primary" @click="onIntroduce">提交</el-button>
        </span>
        </template>
    </el-dialog>
    <!-- 修改外卖起送价 -->
    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-model="minimumOrderAmountShow"
        title="修改外卖起送价"
        width="30%"
        align-center>
        <el-input placeholder="请输入外卖起送价" type="number" min="1" v-model="initialPrice"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button size="default" @click="minimumOrderAmountShow = false">取消</el-button>
            <el-button size="default" type="primary" @click="minimumSubmit">提交</el-button>
        </span>
        </template>
    </el-dialog>
	<!-- 修改营业时间 -->
    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-model="businessShow"
        title="修改店铺营业时间"
        width="30%"
        align-center>
        <el-time-select
        v-model="startTime"
        :max-time="endTime"
        class="time-margin"
        placeholder="开始时间"
        start="08:30"
        step="00:15"
        end="18:30"
        />
        <el-time-select
        v-model="endTime"
        :min-time="startTime"
        placeholder="结束时间"
        start="08:30"
        step="00:15"
        end="18:30"
        />
        <template #footer>
        <span class="dialog-footer">
            <el-button size="default" @click="businessShow = false">取消</el-button>
            <el-button size="default" type="primary" @click="okBusiness">提交</el-button>
        </span>
        </template>
    </el-dialog>
    <!-- 修改店铺地址 -->
    <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        v-model="addressShow"
        title="修改店铺地址"
        width="60%"
        align-center>
        <el-select size="large" v-model="shop_name" filterable remote :remote-method="remoteMethod"
		 :loading="Loading"
		 @change="moDify"
         class="search-address"
		 placeholder="搜索店铺地址">
		    <el-option
		      v-for="item in options"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
			/>
		</el-select>
        <!-- 定义地图显示容器 -->
	    <div class="image-view-title" id="container"></div>
        <template #footer>
        <span class="dialog-footer">
            <el-button size="default" @click="addressHidden">取消</el-button>
            <el-button size="default" type="primary" @click="okAddress">提交</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script setup>
    // 顶部导航组件
    import Paging from '@/page/component/Paging-component.vue'
    // 图片上传
    import UploadImg from '@/page/component/upload.vue'
    import {ref,onMounted, reactive} from 'vue'
    import request from '@/api/request.js'
    // 商家页面信息
    const adminInfo = reactive({
        logo:'',
        _id:'',
        tradeName:'',
        address:'',
        shopIntroduction:'',
        businessHours:'',
		initialPrice:0
    })
    //修改头像弹窗
    const logoShow = ref(false)
    // 修改店铺名称弹窗
    const nameShow = ref(false)
    // 修改店铺介绍弹出框
    const introduceShow = ref(false)
    // 修改营业时间
    const businessShow = ref(false)
	// 修改外卖配送价
	const minimumOrderAmountShow = ref(false)
    const startTime = ref('')
    const endTime = ref('')
    //修改店铺地址
    const addressShow = ref(false)
    const Loading = ref(false)
    const city = ref('')//定位得到当前城市
    const shop_name = ref('')//搜索的店铺名称
    const options = ref([])//存储搜索地址列表
    const address = ref('')//选中的店铺地址
    const longitude = ref('')//选中的经度
    const latitude = ref('')//选中的纬度
    import {MAP} from '@/config/qq-map.js'
    let infoWindowList = Array(20);

    onMounted(()=>{
        const {logo,tradeName,_id,address,shopIntroduction,
		businessHours,initialPrice
		} = JSON.parse(localStorage.getItem('adminInfor'))
        adminInfo.logo = logo || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        adminInfo._id = _id
        adminInfo.tradeName = tradeName || '未设置'
        adminInfo.address = address || '未设置'
        adminInfo.shopIntroduction = shopIntroduction || '未设置'
        adminInfo.businessHours = businessHours.length > 0 ? businessHours.join('——') : '未设置'
		adminInfo.initialPrice = initialPrice || 0
    })

    // 子组件上传图片成功触发
    import emitter from '@/api/event.js'
    const temporary = ref('')
    emitter.on('upload-image-Success', (res) => {
        temporary.value = res.url
	});
    // 确定修改logo
    async function okImage(){
        await request.post('/upload-logo',{value:temporary.value})
        const getadminInfor = JSON.parse(localStorage.getItem('adminInfor'))
        getadminInfor.logo = temporary.value
        localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
        adminInfo.logo = temporary.value
        logoShow.value = false
        emitter.emit('upload-Admin-Success');//更新index页面的logo
        emitter.emit('clear-image');
    }

    // 修改店铺名称
    const tradeName = ref('')
    async function okName(){
        await request.post('/upload-tradeName',{value:tradeName.value})
        const getadminInfor = JSON.parse(localStorage.getItem('adminInfor'))
        getadminInfor.tradeName = tradeName.value
        localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
        adminInfo.tradeName = tradeName.value
        nameShow.value = false
        emitter.emit('upload-Admin-Success');//更新index页面的logo
        tradeName.value = ''
    }

    // 修改店铺介绍
    const shopIntroduction = ref('')
    async function onIntroduce(){
        await request.post('/upload-shopintroduction',{value:shopIntroduction.value})
        const getadminInfor = JSON.parse(localStorage.getItem('adminInfor'))
        getadminInfor.shopIntroduction = shopIntroduction.value
        localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
        adminInfo.shopIntroduction = shopIntroduction.value
        introduceShow.value = false
        shopIntroduction.value = ''
    }
	
	// 修改外卖起送价
	const initialPrice = ref('')
	async function minimumSubmit(){
		await request.post('/upload-initialprice',{value:initialPrice.value})
		const getadminInfor = JSON.parse(localStorage.getItem('adminInfor'))
		getadminInfor.initialPrice = initialPrice.value
		localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
		adminInfo.initialPrice = initialPrice.value
		minimumOrderAmountShow.value = false
		initialPrice.value = ''
	}

    // 修改营业时间
    async function okBusiness(){
        await request.post('/upload-businesshours',{time:[startTime.value,endTime.value]})
        const getadminInfor = JSON.parse(localStorage.getItem('adminInfor'))
        getadminInfor.businessHours = [startTime.value,endTime.value]
        localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
        adminInfo.businessHours = [startTime.value,endTime.value].join('——')
        businessShow.value = false
        startTime.value = ''
        endTime.value = ''
    }
    // 确定修改店铺地址
    async function okAddress(){
        await request.post('/upload-address',{address:address.value,location:[longitude.value,latitude.value]})
        const getadminInfor = JSON.parse(localStorage.getItem('adminInfor'))
        getadminInfor.address = address.value
        localStorage.setItem("adminInfor", JSON.stringify(getadminInfor));
        adminInfo.address = address.value
        addressHidden()
    }

    // 修改店铺地址
    function settingAddress(){
        addressShow.value = true
        setTimeout(()=>{
            initMap()
        },500)
    }
    // 创建地图
    let is_map//初始化地图的方法
    function initMap(){
        // 定位当前城市
        let map = MAP()
        is_map = map
        map.ipLocation.locate({})
        .then(res=>{
            city.value = res.result.ad_info.city
            map.markers.updateGeometries([
                {
                id: 'main',
                position: res.result.location, // 将所得位置绘制在地图上
                },
            ]);
            map.map.setCenter(res.result.location);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // 搜索店铺
    function remoteMethod(event){
        if(event != ''){
            Loading.value = true
            options.value = []
            var suggest = new TMap.service.Suggestion({
            // 新建一个关键字输入提示类
            pageSize: 20, // 返回结果每页条目数
            region: city.value, // 限制城市范围
            regionFix: true, // 搜索无结果时是否固定在当前城市
            });
            suggest.getSuggestions({ keyword: event, location: is_map.map.getCenter() })
            .then(res=>{
                if(res.count > 0){
                    let new_res = res.data.map(item=>{
                        return {
                            'value': `{
                                'shop_name':'${item.title}',
                                'latitude':'${item.location.lat}',
                                'longitude':'${item.location.lng}',
                                'address':'${item.address}'
                            }`,
                            'label': item.title
                        }
                    })
                    // console.log(new_res)
                    options.value = new_res
                    Loading.value = false
                }
                
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    // 选中时触发
    function moDify(event){
        // console.log(eval("(" + event + ")"))
        let res = eval("(" + event + ")")
        longitude.value = Number(res.longitude)//经度
        latitude.value = Number(res.latitude)//纬度
        address.value = res.address
        // 点击输入提示后，于地图中用点标记绘制该地点，并显示信息窗体，包含其名称、地址等信息
        infoWindowList.forEach((infoWindow) => {
            infoWindow.close();
        });
        infoWindowList.length = 0;
        is_map.markers.setGeometries([]);
        is_map.markers.updateGeometries([
            {
            id: '0', // 点标注数据数组{lat: Number(res.latitude),lng: Number(res.longitude)}
            position: new TMap.LatLng(Number(res.latitude), Number(res.longitude)),
            },
        ]);
        var infoWindow = new TMap.InfoWindow({
            map: is_map.map,
            position: new TMap.LatLng(Number(res.latitude), Number(res.longitude)),
            content: `<h3>${res.shop_name}</h3><p>地址：${res.address}</p>`,
            offset: { x: 0, y: -50 },
        });
        infoWindowList.push(infoWindow);
        is_map.map.setCenter(new TMap.LatLng(Number(res.latitude), Number(res.longitude)));
        is_map.markers.on('click', (e) => {
            infoWindowList[Number(e.geometry.id)].open();
        });
    }
    // 销毁地图
    function addressHidden(){
        addressShow.value = false
        shop_name.value = ''
		longitude.value = ''
		latitude.value = ''
        is_map.map.destroy();
    }
</script>

<style>
.setting-name{
    color: #9a9a9a;
	width: 110px
}
.setting-flex{
    flex: 1;
    border-bottom: 1px solid #E7E7EB;
    margin-left: 20px;
    padding: 30px 0;
}
.setting-flex img{
    width: 50px;
    height: 50px;
    object-fit: cover;
}
.setting-flex p:nth-child(2){
    width: 100px;
    text-align: right;
}
.time-margin{
    margin-bottom: 10px;
}
.search-address{
    margin-bottom: 10px;
}
</style>