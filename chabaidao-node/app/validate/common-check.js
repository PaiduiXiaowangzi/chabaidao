module.exports = app => {
    const { validator } = app
    validator.addRule('adminPhone',(rule, value) => {
        if(!/\d{3}-\d{8}|\d{4}-\d{7}|^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/.test(value.trim())) {
            return rule.tips
        }
    })
    validator.addRule('adminPassword',(rule, value) => {
        if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,8}$/.test(value.trim())) {
            return rule.tips
        }
    })
    validator.addRule('nullValue', (rule, value) => {
        if (value.trim() === '') {
            return rule.tips
        }
    })
    validator.addRule('isArray',(rule,value) => {
        if(!Array.isArray(value)) {
            return '该字段必须是数组类型'
        }else if(value.length <=0) {
            return rule.tips
        }else if(value[0] === '' || value[1] === '') {
            return rule.tips
        }
    })
    validator.addRule('goodsStatsIsArray',(rule,value) => {
        if(!Array.isArray(value)) {
            return '该字段必须是数组类型'
        }
    })
    validator.addRule('goodSkuVal',(rule,value) => {
        if(!Array.isArray(value)) {
            return '该字段必须是数组类型'
        }else{
            for(item of value) {
                if(item.price.trim() === '' || item.stock.trim() === '') return '商品的价格或库存不能为空！'
            }
        }
    })
    validator.addRule('receiverAddressVal', (rule, value) => {
        if (!Array.isArray(value)) {
            return '该字段必须是数组类型'
        }
        if (value.length <= 0) {
            return rule.tips
        }
    })

}