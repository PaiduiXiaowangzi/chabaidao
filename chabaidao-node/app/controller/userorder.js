'use strict';

const Controller = require('egg').Controller;

class UserorderController extends Controller {
  // 获取默认地址
  async defaultAddress() {
    const { ctx } = this
    const db = ctx.model.Wxuseraddress
    try{
        const res = await db.find({userOpenid:ctx.auth.uid, defaultAddress:true},{userOpenid:false, defaultAddress:false })
            ctx.send(res)
    }catch{
        ctx.send(500, '获取地址失败')
    }
  }

  // 自提订单
  async selfPickupOrder() {
    const { ctx, service } = this
    const { orderType, userMobile, productOrder } = ctx.request.body
    ctx.validate({
      orderType:{type:'nullValue', tips:'缺少订单类型'},
      userMobile:{type:'nullValue',tips:'缺少电话号码'},
      productOrder:{type:'goodsStatsIsArray',tips:'商品类型错误'}
    },ctx.request.body)
    const orderData = {
      userOpenid:ctx.auth.uid,
      orderType,
      userMobile,
      productOrder
    }
    await service.userorder.submitOrder(orderData)
    ctx.send()
  }
  // 外卖订单
  async outdoorOrder() {
    const { ctx, service } = this
    const { orderType, receiverAddress, productOrder } = ctx.request.body
    ctx.validate({
      orderType:{type:'nullValue', tips:'缺少订单类型'},
      receiverAddress:{type:'receiverAddressVal',tips:'地址不正确'},
      productOrder:{type:'goodsStatsIsArray',tips:'商品类型错误'}
    },ctx.request.body)
    const orderData = {
      userOpenid:ctx.auth.uid,
      orderType,
      receiverAddress,
      productOrder
    }
    await service.userorder.submitOrder(orderData)
    ctx.send()
  }
  // 获取小程序端自己的订单，一次10条
  async allOrderList() {
    const { ctx, service } = this
    const { page } = ctx.query
    ctx.validate({
      page:{type:'nullValue', tips:'分页不能为空'}
    },ctx.query)
    const res = await service.userorder.allOrderList(page, ctx.auth.uid)
    ctx.send(res)
  }

  // 用户获取单个商品详情
  async orderDetails() {
    const {ctx, service} = this
    const {id} = ctx.query
    ctx.validate({
      id:{type:'nullValue',tips:'id值不能为空'}
    },ctx.query)
    const  db = ctx.model.Userorder
    const res = await db.find({_id:id, userOpenid:ctx.auth.uid},{
      userOpenid:false,
      timestamp:false,
      userMobile:false
    })
    ctx.send(res)
  }

  // 后台管理获取商单
  async receiveOrderList() {
    const {ctx, service} = this
    const { page } = ctx.query
    ctx.validate({
      page:{type:'nullValue',tips:'分页值不能为空'}
    },ctx.query)
    const res = await service.userorder.receiveOrderList(page)
    ctx.send(res)
  }
    // 后台管理获取商单详细数据
  async receiveOrderDetails() {
    const { ctx, service } = this
    const { id } = ctx.query
    ctx.validate({
      id:{type:'nullValue', tips:'id值不能为空'}
    },ctx.query)
    const db = ctx.model.Userorder
    const res = await db.find({_id:id},{
      timestamp:false
    })
    ctx.send(res)
  }
}

module.exports = UserorderController;
