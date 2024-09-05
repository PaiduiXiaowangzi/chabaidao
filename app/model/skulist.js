
module.exports = app => {
    const mongoose = app.mongoose
    mongoose.pluralize(null)
    const Schema = mongoose.Schema
    const SkulistSchame = new Schema({
        goods_id: {
            ref:'Goods',
            type: mongoose.Types.ObjectId,
            required:true
        },
        price: {
            type:Number,
            required:true
        },
        stock: {
            type:Number,
            required:true
        },
        specs: {
            type:[String],
            required:true
        },
        skuId: {
            type:[String],
            required:true
        }
    },{ versionKey:false })
    return mongoose.model('Skulist',SkulistSchame)
}