module.exports = app => {
    const mongoose = app.mongoose
    mongoose.pluralize(null)
    const Schema = mongoose.Schema
    const WxuseraddressSchema = new Schema({
        userOpenid: {
            type:String,
            required:true,
            ref:'Wxuserinfo',
        },
        name: {
            type:String,
            required:true
        },
        mobile: {
            type:String,
            required:true
        },
        address: {
            type:String,
            required:true
        },
        defaultAddress: {//默认收货地址
            type: Boolean,
            default: false
        },
        detailedAddress: {
            type:String,
            required:true
        }
    },{versionKey:false})
    return mongoose.model('Wxuseraddress', WxuseraddressSchema)
}