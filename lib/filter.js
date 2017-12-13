/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/10 15:23
 */

// 过滤器

function authorize(req, res, next) { // authorize 批准 权限
    if(!req.session.userId) {
        req.flash('error', 'Sign in please.');
        return res.redirect('/sign-in');
    }
    next(); // 进入下一个中间件，必须调用
}

module.exports.authorize = authorize;