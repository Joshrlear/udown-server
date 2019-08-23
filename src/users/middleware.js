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