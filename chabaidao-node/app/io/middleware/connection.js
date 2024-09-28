const basiAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
module.exports = app => {
    return async (ctx, next) => {
        const { socket } = ctx
        const socketQuery = socket.handshake.query
        const token = basiAuth({headers:{authorization:socketQuery.authorization}})
        if(!token) {
            throw new Error(401)
        }
        try {
            jwt.verify(token.name, ctx.app.config.jwt.secret)
        } catch (error) {
            throw new Error(401)
        }
        if(socketQuery.clientType === 'USER') {
            const db = ctx.model.Admininfo
            const res = await db.find().lean()
            const msg = {
                message:'请问有什么可以帮助你的',
                messagetype:'001',
                avatar:res[0].logo,
                nickname:'',
                userid:''
            }
            socket.emit('wxchat', msg)
        }
        if(socketQuery.clientType === 'ADMIN') {
            socket.join('adminRoom')
        }else {
            socket.join(socketQuery.userid)
        }
        await next()
    }
}