'use strict';

const Controller = require('egg').Controller;

class WxChooseAmenuController extends Controller {
  // 获取商家信息
  async getMerchantInfo() {
    const {ctx} = this
    const db = ctx.model.Admininfo
    const res = await db.find({}).select('tradeName address initialPrice businessHours location ')
    ctx.send(res)
  }
// 计算用户和商家之间的距离
async distanceCalculator() {
  const { ctx, app, service } = this
  const { latitude, longitude } = ctx.query
  ctx.validate({
      latitude: { type: 'nullValue', tips: '维度不能为空' },
      longitude: { type: 'nullValue', tips: '经度不能为空' }
  }, ctx.query)
  const { distance, status, msg, error } = await service.wxChooseAmenu.distanceCalculator(latitude, longitude)
  ctx.send({ distance }, status, msg, error)
}


// 获取商品分类和所有商品
async allGoods() {
  const {ctx, service} = this
  const res = await service.wxChooseAmenu.allGoods()
  ctx.send(res)
}
}




module.exports = WxChooseAmenuController;
