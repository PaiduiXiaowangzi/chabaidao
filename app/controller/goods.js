'use strict';

const Controller = require('egg').Controller;


// 新增商品
class GoodsController extends Controller {
  async addGoods() {
    const { ctx, service } = this
    const {
        category_id,
        goods_image,
        goods_name,
        goods_describe,
        goods_stats,
        goods_sku
    } = ctx.request.body
    ctx.validate({
        category_id:{type:'nullValue', tips:'请选择商品分类'},
        goods_image:{type:'nullValue', tips:'请上传商品图片'},
        goods_name:{type:'nullValue', tips:'请填写商品名称'},
        goods_describe:{type:'nullValue', tips:'请填写商品描述'},
        goods_stats:{type:'goodsStatsIsArray'},
        goods_sku:{type:'goodSkuVal',tips:'价格和库存不能为空'},
    },ctx.request.body)
    await service.goods.addGoods(
        {
            category_id,
            goods_image,
            goods_name,
            goods_describe,
            goods_stats,
            goods_sku
        }
    )
    ctx.send()
  }
}

module.exports = GoodsController;
