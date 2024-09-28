/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
require('dotenv').config();
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'yewenzhuohaoshuai';
  // 阿里云对象存储oss
  config.oss = {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET_NAME,
    region: process.env.OSS_REGION,
    folder: 'chabaidao66'
  }
  // add your middleware config here
  config.middleware = [];
  // 异常处理
  config.onerror = {
    accepts() {
      return 'json'
    },
    json(err, ctx) {
      console.log(err);
      // 自定义错误时的响应体
      if (err.status === 422) {
        if (err.errors[0].message == 'required') {
          ctx.body = {
            msg: '缺少必传参数',
            field: err.errors[0].field
          }
          ctx.status = 400
        } else {
          ctx.body = {
            msg: err.errors[0].message,
            field: err.errors[0].field
          }
          ctx.status = 422
        }
      } else {
        ctx.body = {
          msg: err.message,
          ...(err.errors && { errors: err.errors })
        }
        ctx.status = err.status
      }
    }
  }

  // 连接·1数据库
  config.mongoose = {
    url: 'mongodb://127.0.0.1/chabaidao'
  }
  // 取消安全威胁csrf的防范
  config.security = {
    csrf: {
      enable: false
    }
  }
  // 配置校验
  config.validate = {
    convert: true,
    // validateRoot: false,
  }
  // 配置jwt
  config.jwt = {
    secret: 'wgdgfhguvjkdhgfy46757',
    expiresIn: 60 * 60 * 24 * 3
  }
  // 跨域
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  // 文件上传
  config.multipart = {
    mode: 'file',
    fileSize: '1mb',
  }
    // 腾讯地图key
    config.wxqq = {
      key: process.env.WXQQ_KEY
    }
    // 微信小程序相关
    config.wxAppid = {
      appid: process.env.WX_APPID,
      secret: process.env.WX_APPSECRET
    }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.io = {
    init: {}, // 传递给 engine.io
    namespace: {
        '/': {
            connectionMiddleware: ['connection'],
            packetMiddleware: [],
        }
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
