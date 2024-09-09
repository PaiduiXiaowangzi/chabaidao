module.exports = app => {
    const mongoose = app.mongoose
mongoose.pluralize(null)

const Schema = mongoose.Schema

const RecommendGoodsSchema = new Schema({
    goodsId: {
        type: mongoose.Types.ObjectId,
        ref:'Goods',
        required:true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref:'Category',
        required:true
    },
    carouselImages: {
        type:String,
        required:true
    }
},{versionKey:false})
return mongoose.model('RecommendGoods',RecommendGoodsSchema)
}