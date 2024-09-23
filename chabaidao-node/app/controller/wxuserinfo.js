'use strict';

const Controller = require('egg').Controller;

class WxuserinfoController extends Controller {
  // 小程序用户登录
  async wxLogin() {
    const { ctx, service } = this
    const { code } = ctx.query
    ctx.validate({
      code:{ type:'nullValue', tips:'缺少code参数!' }
    }, ctx.query)
    const res = await service.wxuserinfo.wxLogin(code)
    ctx.send(res)
  }

  //修改头像昵称
  async uploadWxUser() {
    const { ctx, service } = this
    const { avatar, nickname } = ctx.request.body
    ctx.validate({
        avatar:{ type:'nullValue', tips:'请上传头像' },
        nickname:{ type:'nullValue', tips:'请填写昵称' }
    },ctx.request.body)
    const db = ctx.model.Wxuserinfo
    await db.findOneAndUpdate({openid:ctx.auth.uid},{avatar, nickname})
    ctx.send()
  }
}

module.exports = WxuserinfoController;
