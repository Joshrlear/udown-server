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
    if (!req.headers.user_id) {
        res.status(401);
        next(new Error('Un-Authorized'));
    }
    else {
        next();
    }
}

module.exports = {
    isLoggedIn,
    allowAccess
};