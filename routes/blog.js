/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/3 17:03
 */
const db = require('../lib/db');

module.exports = function (app) {
    app.get('/blog/:username', (req, res) => {
        let username = req.params.username;
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
            u.username = ?
        ORDER BY id DESC   
        `;
        db.pool.query(sql, [username], (err, results, fields) => {
            if (err) throw err;
            res.render('blog', {
                session: req.session,
                posts: results
            });
        });
    });
};