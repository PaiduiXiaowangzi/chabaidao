//启动项目即对校验进行加载
// const path = require('path')
// module.exports = app => {
//     const dire = path.join(app.config.baseDir,'app/validate')
//     app.loader.loadToApp(dire,'validate')
// }

const path = require('path')
require('dotenv').config();
module.exports = app => {
    const dire = path.join(app.config.baseDir,'app/validate')
    app.loader.loadToApp(dire,'validate')
}