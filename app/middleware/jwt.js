const basiAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

module.exports = (options, app) => {
    return async (ctx, next) => {
        const token = basiAuth(ctx.req)
        if(!token || !token.name) {
            return ctx.send([],401,'未登录，没有访问权限')
        }
        try{
            var authcode = jwt.verify(token.name, ctx.app.config.jwt.secret)
        }catch (error){
            console.log(error)
            if(error.name == 'TokenExpiredError') {
                return ctx.send([], 401, '登录过期，请重新登录')
            }
            return ctx.send([], 401, '未登录，没有访问权限')
        }
        ctx.auth = {
            uid: authcode.uid
        }
        await next()
    }
}