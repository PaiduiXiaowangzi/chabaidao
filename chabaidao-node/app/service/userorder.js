'use strict';

const Service = require('egg').Service;

class UserorderService extends Service {
  async submitOrder(orderData) {
    const db = this.ctx.model.Userorder
    const res = await db.create(orderData)
    if(orderData.orderType === '001') {
      const lastOrder = await db.find({ orderType:'001' }).sort('-takeMealCode').limit(1)
      const newCode = lastOrder[0].takeMealCode + 1
      await db.findByIdAndUpdate({_id:res._id},{takeMealCode:newCode})
    }
    const Skulist = this.ctx.model.Skulist
    const Goods = this.ctx.model.Goods
    for(let item of orderData.productOrder) {
      if(item.sku.length > 0) {
        await Skulist.updateOne({_id:item.sku_id}, {$inc:{stock:-item.goodsQuantity}})
      }
      await Goods.updateOne({_id:item.goods_id},{$inc:{goods_stock:-item.goodsQuantity } })
      await Goods.updateOne({_id:item.goods_id},{$inc:{sales_valume:item.goodsQuantity } })
    }
    // this.app.io.emit('orderinform',0)
    return
  }
  async allOrderList(page, userOpenid) {
    const db = this.ctx.model.Userorder
    const res = await db.aggregate([
      {$match: {userOpenid}},
      {$sort: {timestamp: -1}},
      {$skip: (page - 1) *10},
      {$limit: 10},
      {
        $project: {
          orderType: true,
          productOrder: { $slice:['$productOrder', 1] },
          paymentPrice:true,
          productOrderCount:{ $size:"$productOrder" }
        }
      }
    ])
    return res
  }
}

module.exports = UserorderService;
