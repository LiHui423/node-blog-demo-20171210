/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/3 11:33
 */

const db = require('../lib/db');

module.exports = function (app) {

    app.get('/', (req, res) => {
        let sql = `
        SELECT 
            p.*, 
            u.id AS userId,
            u.username,
            u.avatar
        FROM 
            blog.post p
        RIGHT OUTER JOIN
            blog.user u
        ON
            p.userId = u.id
        ORDER BY id DESC  
        `;
        db.pool.query(sql, (err, results, fields) => {
            res.render('index', {
                session: req.session,
                posts: results
            });
        });
    });

    app.get('/sign-up', (req, res) => {
        res.render('sign-up', { // render 渲染模板：EJS
            session: req.session, // header.html <%=session...
            success: req.flash('success'), // sign-up.html <%=success
            error: req.flash('error') // sign-up.html <%=error
        });
    });

    app.get('/sign-in', (req, res) => {
        res.render('sign-in', {
            session: req.session,
            success: req.flash('success'),
            error: req.flash('error')
        });
    });

    app.get('/sign-out', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });
};