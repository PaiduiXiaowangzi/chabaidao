'use strict';

const Controller = require('egg').Controller;

class WxHomepageController extends Controller {
  async getSwiper() {
    const {ctx, service} = this
    const db = ctx.model.RecommendGoods
    const res = await db.find({})
    ctx.send(res)
  }
}

module.exports = WxHomepageController;
