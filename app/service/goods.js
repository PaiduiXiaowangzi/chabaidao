'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
  async addGoods(obj) {
    const totalStock = obj.goods_sku.reduce((total,sku) => total + Number(sku.stock),0)
    const minPrice = Math.min(...obj.goods_sku.map(sku => Number(sku.price)))
    const db = this.ctx.model.Goods
    const goodsId = await db.create({
        category_id:obj.category_id,
        goods_image:obj.goods_image,
        goods_name:obj.goods_name,
        goods_describe:obj.goods_describe,
        goods_stats:obj.goods_stats,
        goods_price:minPrice,
        goods_stock:totalStock
    })
    if(obj.goods_stats.length <= 0) return 
    const dbSku = this.ctx.model.Skulist
    const newskuArray = obj.goods_sku.map(sku => (
        {
            goods_id:goodsId._id,
            price:sku.price,
            stock:sku.stock,
            specs:sku.specs,
            skuId:sku.skuId
        }
    ))
    await dbSku.insertMany(newskuArray)
  }
}

module.exports = GoodsService;
