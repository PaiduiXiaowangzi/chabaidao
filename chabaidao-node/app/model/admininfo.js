module.exports = app => {
    const mongoose = app.mongoose
    mongoose.pluralize(null)
    const Schema = mongoose.Schema
    const AdminSchema = new Schema({
        logo: {
            type:String,
            default:''
        },
        tradeName: {//店铺名称
            type:String,
            default:''
        },
        account: {//账号 
            type:String,
            required:true,
            trim:true
        },
        password: {
            type:String,
            required:true,
            select:false
        },
        address: {
            type:String,
            default:''
        },
        location: {//商家详细地址
            type:[Number],
            default:[]
        },
        adminUid: {//唯一标识Uid
            type:String,
            unique:true,
            default: () => new Date().getTime()
        },
        shopIntroduction: {//店铺介绍
            type:String,
            default:''
        },
        initialPrice: {//起送价
            type:Number,
            default:0
        },
        businessHours: {
            type:[String],
            default:''
        }
    },{versionKey:false})
    
    return mongoose.model('Admininfo',AdminSchema)
}