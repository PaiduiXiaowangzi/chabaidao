module.exports = app => {
    const mongoose = app.mongoose
    mongoose.pluralize(null)
    const Schema = mongoose.Schema
    const WxuserinfoSchema = new Schema({
        avatar: {
            type:String,
            default: 'https://chabaidao66.oss-cn-guangzhou.aliyuncs.com/chabaidao661726888868258954.png'
        },
        nickname: {
            type:String,
            default:'没名字的憨憨'
        },
        openid:String
    },{versionKey:false})
    return mongoose.model('Wxuserinfo',WxuserinfoSchema)
}