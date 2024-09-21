const jwt = require("jsonwebtoken")
const checkAuth = (req, res, next) => {
    try
    {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, 'ThisIsTheStringIWillBeUsingForEncryptingTheTokenGenerated')
        next()
    }
    catch(err)
    {
        res.status(401).json({message: 'User not authenticated'})
        console.error(err)
    }
}

module.exports = checkAuth