'use strict';

const Controller = require('egg').Controller;

class RecommendgoodsController extends Controller {
  // 添加轮播图
  async addRecommend() {
    const {ctx, service} = this
    const {carouselImages, categoryId, goodsId} = ctx.request.body
    ctx.validate({
        carouselImages: {type:'nullValue', tips:'请上传轮播图'},
        categoryId: {type: 'nullValue', tips:'请选择关联商品'},
        goodsId: { type:'nullValue', tips:'请上传关联商品'}
    },ctx.request.body)
    const db = ctx.model.RecommendGoods
    await db.create({carouselImages, categoryId, goodsId})
    ctx.send()
  }

  //   获取推荐商品列表数据
  async getRecommend() {
    const {ctx, service} = this
    const res = await service.recommendGoods.getrecommend()
    ctx.send(res)
  }
  // 删除推荐商品列表数据
  async deleteRecommend() {
    const{ctx, service} = this
    const {_id} = ctx.query
    ctx.validate({
        _id:{type:'nullValue', tips:'缺少_id字段'}
    },ctx.query)
    const db = ctx.model.RecommendGoods
    await db.findByIdAndDelete({_id})
    ctx.send()
  }

}


module.exports = RecommendgoodsController;
