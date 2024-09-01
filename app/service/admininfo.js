'use strict';

const Service = require('egg').Service;
const crypto = require('crypto')

class AdmininfoService extends Service {
  async adminRegister(account, password) {
    const db = this.ctx.model.Admininfo
    const res = await db.find({account})
    if(res.length > 0) {
        return {msg:'该账号已存在',code:202}
    }else {
        const hash = crypto.createHash('sha256').update(password)
        const passwordHash = hash.digest('hex')
        await db.create({account,password:passwordHash})
        return {msg:'SUCCESS', code: 200}
    }
  }

  async adminLogin(account, password) {  
    const hash = crypto.createHash('sha256').update(password)
    const passwordHash = hash.digest('hex')
    const db = this.ctx.model.Admininfo
    const res = await db.find({account,password:passwordHash},
      {account:false, location:false}
    ).lean()
    if(res.length > 0) {
      const token = {admon_Token: this.ctx.generateToken(res[0].adminUid)}
      return {
        data: {...res[0],...token},
        msg: 'SUCCESS',
        code: 200
      }
    } else {
      return {data:[], msg:'账号或密码错误', code:422}
    }
  }

}

module.exports = AdmininfoService;
