function isLoggedIn(req, res, next) {
    //console.log('is this working?', req)
    if (req.signedCookies.user_id) {
        next()
    }
    else {
        res.status(401)
        next(new Error('Un-Authorized'))
    }
}

module.exports = {
    isLoggedIn
}