const moment = require('moment')
moment.locale('zh-cn')
const Decimal = require('decimal')
module.exports = app => {
    const mongoose = app.mongoose;
    mongoose.pluralize(null)//去掉集合后面的s
    const Schema = mongoose.Schema;
    const UserorderSchema = new Schema({
        userOpenid: {//关联用户的openid
            type: String,
            required: true,
            ref: 'Wxuserinfo',
            localField: 'userOpenid',
            foreignField: 'openid',
            select: false,//私密
        },
        orderTime: {//下单时间
            type: String,
            required: true,
            default: () => moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
        },
        timestamp: {//下单时间戳
            type: Number,
            default: () => moment().unix()
        },
        takeMealCode: {//取餐码
            type: Number,
            default: 1000
        },
        orderNumber: {//订单号
            type: String
        },
        orderType: {//订单类型
            type: String,
            required: true
        },
        receiverAddress: [//收货地址
            {
                name: {//姓名
                    type: String,
                    required: true
                },
                mobile: {//手机号码
                    type: String,
                    required: true
                },
                address: {//省市区
                    type: String,
                    required: true
                },
                detailedAddress: {//详细地址
                    type: String,
                    required: true
                }
            }
        ],
        userMobile: {//到店取餐手机号
            type: String,
            default: ''
        },
        productOrder: [//提交的订单
            {
                fatherId: {//父级id
                    type: String,
                    required: true
                },
                sonId: {//子级id
                    type: String,
                    required: true
                },
                goods_name: {//商品名称
                    type: String,
                    required: true
                },
                goods_image: {//商品图片
                    type: String,
                    required: true
                },
                goods_id: {//商品id
                    type: String,
                    required: true
                },
                goodsPrice: {//商品价格
                    type: Number,
                    required: true
                },
                goodsQuantity: {//商品数量
                    type: Number,
                    required: true
                },
                totalPrice: {//商品总价
                    type: Number,
                    required: true
                },
                sku: {//sku属性
                    type: [String],
                    default: []
                },
                skuIdArr: {//sku属性id
                    type: [String],
                    default: []
                },
                sku_id: {//sku对象id
                    type: String,
                    default: ''
                }
            }
        ],
        paymentPrice: Number//支付总价
    }, { versionKey: false })
    UserorderSchema.pre('save', function(next) {
        const currentDate = moment().format('YYYYMMDD')
        const currentTime = moment().format('HHmmssSSS')
        const randomNum = Math.floor(Math.random()* 1000).toString().padStart(4,'0')
        this.orderNumber = currentDate + currentTime + randomNum
        const res = this.productOrder.reduce((subtotal, goodsItem) => subtotal + goodsItem.totalPrice, 0)
        this.paymentPrice = Number(new Decimal(res)).toFixed(2)
        next()
    })
    return mongoose.model('Userorder', UserorderSchema)
}