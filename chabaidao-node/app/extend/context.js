const jwt = require('jsonwebtoken')
module.exports = {
    get ctx() {
        return this
    },
    send(data = [],status = 200, msg = 'SUCCESS', error = null) {
        this.body = {msg, data, error}
        this.status = status
    },

    generateToken(uid) {
        const {secret, expiresIn} = this.app.config.jwt
        return jwt.sign({uid},secret,{ expiresIn })
    }
}