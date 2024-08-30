'use strict';

const Controller = require('egg').Controller;
const OSS = require('ali-oss');

class UploadController extends Controller {
    async uploadFile() {
        const { ctx, app } = this
        if (ctx.request.files.length <= 0) {
            ctx.send([], 422, '上传图片不能为空')
            return
        }
        // 对文件重新命名
        const fileFormat = ctx.request.files[0].filename.split('.')
        const timestamp = new Date().getTime()
        const randomNum = Math.floor(Math.random() * 1000)
        const uploadKey = `${app.config.oss.folder}${timestamp}${randomNum}.${fileFormat[1]}`
        const client = new OSS({
            region: app.config.oss.region,
            accessKeyId: app.config.oss.accessKeyId,
            accessKeySecret: app.config.oss.accessKeySecret,
            bucket: app.config.oss.bucket,
            secure: true
        });
        const headers = {
            'Content-Disposition': 'inline',
            'Content-Type': 'image/jpg'
        }
        try {
            const result = await client.put(uploadKey, ctx.request.files[0].filepath, { headers })
            if (result.res.statusCode === 200) {
                ctx.send(result.url)
            } else {
                throw result
            }
        } catch (error) {
            ctx.send([], 500, '上传失败', error)
        }
    }
}

module.exports = UploadController;