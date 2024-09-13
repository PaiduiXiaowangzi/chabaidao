'use strict';

const Service = require('egg').Service;
const axios = require('axios')

class WxChooseAmenuService extends Service {
    // 计算商家距离
    async distanceCalculator(latitude, longitude) {
        const { ctx, app } = this
        const db = ctx.model.Admininfo
        const locationRes = await db.find({}).select('location')
        const url = 'https://apis.map.qq.com/ws/distance/v1/matrix?'
        const params = {
            'key': app.config.wxqq.key,
            'from': `${latitude},${longitude}`,
            'to': `${locationRes[0].location[1]},${locationRes[0].location[0]}`,
            'mode': 'driving'
        }
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&')
        const res = await axios.get(url + queryString)
        if (res.data.status === 0) {
            const distance = res.data.result.rows[0].elements[0].distance
            // 米转公里
            var km = '0米'
            if (distance >= 1000) {
                km = (distance / 1000).toFixed(2) + 'km'
            } else {
                km = distance + 'm'
            }
            return { distance: km, status: 200, msg: 'SUCCESS', error: null }
        } else {
            return { distance: [], status: 500, msg: '出错', error: res.data }
        }
    }
}

module.exports = WxChooseAmenuService;
