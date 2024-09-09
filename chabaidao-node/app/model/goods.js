module.exports = app => {
    const mongoose = app.mongoose
    mongoose.pluralize(null)
    const Schema = mongoose.Schema
    const GoodSchame = new Schema({
        category_id : {
            type: mongoose.Types.ObjectId,
            ref:'Category',
            required:true
        },
        goods_image: {
            type:String,
            required:true
        },
        goods_name: {
            type:String,
            required:true
        },
        goods_describe: {
            type:String,
            required:true
        },
        goods_price: {
            type:Number,
            required:true
        },
        goods_stock: {
            type:Number,
            required:true
        },
        quantity: {
            type:Number,
            default:0
        },
        sales_valume: {
            type:Number,
            default:0
        },
        goods_stats: [
            {
                name:String,
                selected: {
                    type:String,
                    default: ''
                },
                disabled: {
                    type:Boolean,
                    default:false
                },
                subAttributes: [
                    {
                        name:String,
                        statsId:String,
                        disabled:{
                            type:Boolean,
                            default: false
                        },
                        selected: {
                            type:String,
                            default:''
                        }
                    }
                ]
            }
        ]
    },{versionKey:false})
    return mongoose.model('Goods',GoodSchame)
}