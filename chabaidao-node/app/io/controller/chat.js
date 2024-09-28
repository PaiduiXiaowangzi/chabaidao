'use strict';

const Controller = require('egg').Controller;

class ChatController extends Controller {
    // 接受用户发来的消息
  async userMessage() {
    const { ctx, app } = this
    const message = ctx.args[0]
    console.log('用户发来信息'+JSON.stringify(message))
    app.io.to('adminRoom').emit('adminchat',message)
  }
  接受后台管理发来的消息
  async adminMessage() {
    const { ctx, app } = this
    const message = ctx.args[0]
    app.io.to(message.userid).emit('wxchat',message)
  }
}

module.exports = ChatController;
