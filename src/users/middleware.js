function isLoggedIn(req, res, next) {
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}

function allowAccess(req, res, next) {
    console.log('allow access firing!')
    console.log('&^^^^', req.headers.user_id)
    if (!req.headers.user_id) {
        res.status(401);
        console.log('should go to next method with error')
        next(new Error('Un-Authorized'));
    }
    else {
        console.log('should go to next method')
        next();
    }
}

module.exports = {
    isLoggedIn,
    allowAccess
};