export const BaseUrl:string = 'http://127.0.0.1:7001'
const requestAddress:string = BaseUrl + '/api/wx'

export const uploadFileUrl:string = BaseUrl + '/api/admin/uploadFile'

interface Data<T>{
    data:T
    error:any
    msg:string
}

export const request = <T>(url:string, data:object = {}, method:'GET' | 'POST' = 'GET') => {
    return new Promise<Data<T>>((resolve, reject) => {
        uni.request({
            url:requestAddress + url,
            method,
            data,
            success: (res) => {
                const status = res.statusCode
                switch(status){
                    case 200:
                        resolve(res.data as Data<T>)
                        break
                    case 404:
                        reject('接口不存在')
                        break
                    case 401:
                        uni.navigateTo({ url: '/pages/login/index' })
                        console.log('没有权限')
                        reject('401')
                    case 500:
                    case 501:
                    case 503:
                        uni.showToast({
                            title:'出现异常错误',
                            icon:'none'
                        })
                        console.error('出现异常')
                        reject('出现异常')
                    case 400:
                        console.error((res.data as Data<T>).msg)
                        reject('400')
                        break
                    case 422:
                        uni.showToast({
                            title: (res.data as Data<T>).msg,
                            icon:'none'
                        }),
                        reject('422')
                        break
                }
            },
            fail:(err:any) => {
                uni.showToast({
                    title: err,
                    icon: 'none',
                })
                reject(err)
            }
        })
    })
}