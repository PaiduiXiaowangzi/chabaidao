<template>
	<div id="Content-page">
	    <Paging :pagData="[{name:'客服',router:''}]" />
		<div class="content-main">
			<div class="Chat-area">
				<div class="global-display global-f-flex">
					<div class="chat-left">
						<div class="user-message" v-for="(item,index) in userListMessages" :key="index" 
						:class="{'actives':userListIndex === index}" @click="selectUser(item.useridIng,index)">
							<img :src="item.avatarIng">
							<div>
								<p>{{item.nicknameIng}}</p>
								<p>{{item.messageIng}}</p>
							</div>
						</div>
					</div>
					<div class="chat-right global-display global-f-direction global-j-content global-f-flex">
						<div class="Chat-content" ref="scrollContainer">
							<div class="global-display global-f-direction" v-for="(item,index) in selectMessage" :key="index">
								<!-- 用户 -->
								<div class="message msg-left" v-if="item.messagetype == '002'">
									<img :src="item.avatar"/>
									<p>{{ item.message }}</p>
								</div>
								<!-- 管理员 -->
								<div class="message msg-right" v-else>
									<p>{{ item.message }}</p>
									<img :src="item.avatar"/>
								</div>
							</div>
						</div>
						<div>
							<el-input
							    v-model="userMessage"
							    :rows="4"
								resize="none"
							    type="textarea"
							    placeholder="请输入聊天内容"
								@keyup.enter="sendMessage"
								:disabled="selectMessage.length > 0 ? false : true"
							/>
						</div>
						<el-button class="send-message" type="primary" :disabled="selectMessage.length > 0 ? false : true" size="default" @click="sendMessage">发送</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	// 顶部导航组件
	import Paging from '@/page/component/Paging-component.vue'
	import {ref,onMounted, reactive,computed} from 'vue'
	import request from '@/api/request.js'
	import { Base64 } from 'js-base64';
	import {socketObj,userInfo} from '@/api/socket.js'
	// 输入的消息
	const userMessage = ref('')
	// 聊天框的消息·
	const messageData = ref([])
	// 左边用户消息列表
	const userListMessages = ref([])
	const userListIndex = ref(-1)
	const scrollContainer = ref(null);
	
	// 发送消息
	function sendMessage(){
		if(userMessage.value.trim() == '')return
		let msgObj = {
            userid:userId.value,//某个用户的id
			messagetype: '001',//类型
			message: userMessage.value,
			avatar: userInfo().logo,//头像
			nickname:userInfo().tradeName//昵称
        }
		socketObj.value.emit('adminMessage', msgObj);
		const userIndex = messageData.value.findIndex(item=>item.userid === userId.value)
		messageData.value[userIndex].data.push(msgObj)
		userMessage.value = ''
		setTimeout(()=>{
			scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
		},300)
	}
	onMounted(()=>{
		// 收到用户发来的消息
		setTimeout(()=>{
			socketObj.value.on('adminchat',(res)=>{
				// console.log(res)
				if(messageData.value.length <= 0){
					messageData.value = [
						{
							userid:res.userid,
							data:[res]
						}
					]
				}else{
					const userIndex = messageData.value.findIndex(item=>item.userid === res.userid)
					if(userIndex === -1){
						messageData.value.push({
							userid:res.userid,
							data:[res]
						})
					}else{
						messageData.value[userIndex].data.push(res)
					}
				}
				// 如果已有用户消息，只更新聊天消息，头像昵称不变
				const obj = {
					avatarIng: res.avatar,
					messageIng: res.message,
					messagetypeIng: res.messagetype,
					nicknameIng: res.nickname,
					useridIng:res.userid
				}
				if(userListMessages.value.length > 0){
					if(userListMessages.value.some(item=>item.useridIng === res.userid)){
						const userListIndexs = userListMessages.value.findIndex(item=>item.useridIng === res.userid)
						userListMessages.value[userListIndexs].messageIng = res.message
					}else{
						userListMessages.value.push(obj)
					}
				}else{
					userListMessages.value.push(obj)
				}
			})
		},1000)
	})
	
	// 聊天区域消息
	const selectMessage = ref([])
	// 选中发送的用户id
	const userId = ref('')
	function selectUser(userid,index){
		userListIndex.value = index
		userId.value = userid
		messageData.value.forEach(item=>{
			if(item.userid === userid){
				selectMessage.value = item.data
			}
		})
	}
	

</script>

<style>
	.Chat-area{
		display: flex;
		height: 700px;
	}
	.chat-left{
		width: 150px;
		height: 700px;
		overflow-y: auto;
		background-color: #f5f5f5;
	}
	.user-message{
		display: flex;
		padding: 8px;
	}
	.user-message img{
		width: 40px;
		height: 40px;
		border-radius: 4px;
		object-fit: cover;
		display: block;
		margin-right: 5px;
	}
	.user-message p{
		overflow:hidden; 
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:1;
	}
	.user-message p:nth-child(2){
		font-size: 14px;
		color: #666;
		padding-top: 2px;
	}
	.actives{
		background: burlywood;
	}
	.chat-right{
		background-color: #eaeaea;
	}
	.Chat-content{
		height: 550px;
		overflow-y: auto;
		padding: 0 10px;
	}
	.send-message{
		align-self: flex-end;
		margin: 0 4px 4px 0;
	}
	.message{
	    display: flex;
	    align-items: center;
	    margin: 15px 0;
	}
	.message img{
	    width: 30px;
	    height: 30px;
	    border-radius: 5px;
		object-fit: cover;
	}
	.message p{
	    border-radius: 5px;
	    padding: 3px 7px;
	}
	.msg-right{
	    align-self: flex-end;
	}
	.msg-left{
	    padding-right: 95px;
	}
	.msg-right{
	    padding-left: 95px;
	}
	.msg-left p{
	    background-color: #ffffff;
	    margin-left: 5px;
	}
	.msg-right p{
	    background-color: #304bcc;
	    color: #ffffff;
	    margin-right: 5px;
	}
</style>