'use strict';

const Controller = require('egg').Controller;

class AdmininfoController extends Controller {
  async adminRegister() {
    const {ctx,service} = this
    const{password, phone} = ctx.request.body
    // const {phone,password} = ctx.request.body
    console.log(ctx.request.body)
    ctx.validate({
      phone:{type:'adminPhone',tips:'手机号格式不正确！'},
      password:{type:'adminPassword',tips:'密码格式不正确!'}
    },ctx.request.body)
    const res = await service.admininfo.adminRegister(phone,password)
    ctx.send([],res.code,res.msg)
  }

  async adminLogin() {
    const {ctx, service} = this
    const {phone, password} = ctx.request.body
    ctx.validate({
      phone:{type:'adminPhone',tips:'手机号码格式不正确'},
      password:{type:'adminPassword',tips:'密码格式错误'}
    },ctx.request.body)
    const {data, code, msg} = await service.admininfo.adminLogin(phone, password)
    ctx.send(data, code, msg)
  }
}

module.exports = AdmininfoController;
