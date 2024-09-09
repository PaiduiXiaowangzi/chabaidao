'use strict';

const Service = require('egg').Service;

class GetCategoryService extends Service {
  async getCategory(page) {
    const db = this.ctx.model.Category
    const res = await db.aggregate([
        {$skip:(page-1) * 10},
        {$limit:10},
        {
            $lookup: {
                from:'Goods',
                localField:'_id',
                foreignField:'category_id',
                as:'quantity'
            }
        },
        {
            $project:{
                '_id':1,
                'categoryName':1,
                'icon':1,
                'quantity':{$size:'$quantity'}
            }
        }
    ])
    const total = await db.countDocuments()
    return {categoryData:res, total}
  }
}

module.exports = GetCategoryService;
