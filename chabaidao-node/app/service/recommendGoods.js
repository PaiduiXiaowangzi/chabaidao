'use strict';

const Service = require('egg').Service;

class RecommendGoodsService extends Service {
  async getrecommend() {
    const db = this.ctx.model.RecommendGoods
    const res = await db.aggregate([
        {
            $lookup: {
                from: 'Goods',
                localField:'goodsId',
                foreignField:'_id',
                as:'goodsData'
            }
        },
        {$unwind:'$goodsData'},
        {
            '$project' : {
                '_id' : 1,
                'carouselImages': 1,
                'goods_name': '$goodsData.goods_name',
                'goods_price': '$goodsData.goods_price',
                'goods_stock': '$goodsData.goods_stock',
                'sales_valume': '$goodsData.sales_valume'
            }
        }
    ])
    return res
  }
}

module.exports = RecommendGoodsService;
