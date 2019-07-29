function isLoggedIn(req, res, next) {
    console.log('is this working?', req.signedCookies);
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}

function allowAccess(req, res, next) {
    console.log('the user params: ', req.params.user_id)
    if (req.signedCookies.user_id == req.params.user_id) {
        next();
    }
    else {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
}

module.exports = {
    isLoggedIn,
    allowAccess
};