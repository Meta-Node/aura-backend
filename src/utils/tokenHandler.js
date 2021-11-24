const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        req.authData = user
        console.log(token)
        console.log(user)

        next()
    })
}

module.exports = {authenticateToken}