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
}

module.exports = UserorderController;
