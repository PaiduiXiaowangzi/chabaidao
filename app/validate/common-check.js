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
        if(value == null || value.trim() === "") {
            return rule.tips
        }
    })
}