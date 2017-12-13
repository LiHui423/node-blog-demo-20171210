/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/3 17:02
 */
const db = require('../lib/db');
const filter = require('../lib/filter');

module.exports = function (app) {
    app.get('/post', filter.authorize, (req, res) => {
        res.render('post', {
            session: req.session,
            success: req.flash('success'),
            error: req.flash('error')
        });
    });

    app.post('/post/create', filter.authorize, (req, res) => {
        let title = req.body.title;
        let content = req.body.content;
        let userId = req.session.userId;
        let sql = 'INSERT INTO blog.post(title, content, userId)  VALUE(?, ?, ?)';
        db.pool.query(sql, [title, content, userId], (err, results, fileds) => {
            if (err) {
                req.flash('error', 'Publish failed.');
                return res.redirect('back');
            }
            if (results.affectedRows === 1) {
                res.redirect('/blog/' + req.session.username);
            } else {
                req.flash('error', 'Publish failed.');
                res.redirect('back');
            }
        });
    });

    app.get('/post/:postId', (req, res) => {
        let postId = req.params.postId;
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
        WHERE
            p.id = ?
        `;
        db.pool.query(sql, [postId], (err, results, fields) => {
            if (err) {
                req.flash('error', 'Failed');
                return res.redirect('back');
            }
            res.render('entry', {
                session: req.session,
                post: results[0]
            });
        });
    });
};