
module.exports = app => {
    const mongoose = app.mongoose
    mongoose.pluralize(null)//去掉集合后面的s
    const Schema = mongoose.Schema
    const CategorySchema = new Schema({
        categoryName: {
            type: String,
            required:true
        },
        icon: {
            type: String,
            required:true,
        }
    },{versionKey:false})
    return mongoose.model('Category', CategorySchema)
}