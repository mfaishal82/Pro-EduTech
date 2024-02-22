let isLoggedIn = function (req, res, next) {
    if(!req.session.UserId){
        const msg = 'Please login first'
        res.redirect(`/login?error=${msg}`)
    } else {
        next()
    }
}

let isAdmin = function (req, res, next) {
    if(req.session.UserId && req.session.role !== 'admin' ){
        const msg = 'Only admin'
        res.redirect(`/courses?error=${msg}`)
    } else {
        next()
    }
}

module.exports = {isLoggedIn, isAdmin}