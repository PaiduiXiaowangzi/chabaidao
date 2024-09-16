import {domain} from '@/api/request'
import { Base64 } from 'js-base64';
import io from '@/api/weapp.socket.io.js'
import {ref} from 'vue'
import { useRouter } from 'vue-router'
const $router = useRouter()  // 这是路由跳转的
export const socketObj = ref()
export const soCketObj = ()=>{
	socketObj.value = io(domain,{
		transports: ["websocket"],
		query:{
			authorization:userInfo().token,
			clientType:'ADMIN',
			userId:userInfo().id
		},
		reconnectionAttempts: 4, // 失败后重新连接次数，一直失败总共尝试四次
		reconnectionDelay: 2000, // 重新连接间隔时间毫秒
		forceNew:true,
	})
	socketObj.value.on('connect',  (res)=> {
		console.log('SOCKET连接成功' + res);
	});
	socketObj.value.on('reconnect_failed', () => {
		console.log('SOCKET重连失败');
	}) 
	socketObj.value.on('reconnect_attempt', () => {
		console.log('SOCKET正在重连');
	})                      
	socketObj.value.on('disconnect', (res) => {
		console.log('SOCKET连接断开' + res);
	}) 
	socketObj.value.on('error', (err) => {
		console.log('SOCKET连接错误');
		console.log(err)
		if(err == 401){
			// 需要登录
			$router.push('/')
		}
	})
}

// 获取本地token
export const userInfo = () =>{
	const { admin_Token,_id,logo,tradeName } = JSON.parse(localStorage.getItem('adminInfor')) || ''//从本地缓存里取出token
	const auth = Base64.encode(admin_Token + ':')//对token加密
	return{
		token:'Basic ' + auth,
		id:_id,
		logo,
		tradeName
	}
}