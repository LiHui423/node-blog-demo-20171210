/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/3 12:03
 */

const bcrypt = require('bcryptjs');
const db = require('../lib/db');
const path = require('path');
const avatarFileTypesPatt = /(png|jpg|gif|svg)/i;

module.exports = function (app) {

    app.post('/signUp', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        let avatar = req.files.avatar;
        let fileName = 'default.svg';
        if (avatar) {
            let extName = path.extname(avatar.name); // .jpg .png ...
            if (!avatarFileTypesPatt.test(extName)) { // todo better method: mmmagic
                req.flash('error', 'Avatar file is invalid.');
                return res.redirect('back');
            } else {
                fileName = Date.now() + extName;
                avatar.mv(path.join(__dirname, '../public/avatars/' + fileName));
            }
        }

        let sql = 'SELECT * FROM blog.user WHERE username = ?';
        /*
        // 不推荐
        db.pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query(sql, [], (err, resutls, fields) => {
                if(err) throw err;
                // ...
            });
            connection.release();
        });
        */
        db.pool.query(sql, [username], (err, results, fields) => {
            if (err) {
                req.flash('error', 'Sign up failed.');
                return res.redirect('back');
                // throw err;
            }
            if (results.length === 1) {
                req.flash('error', 'Username existed.');
                return res.redirect('back'); // 重定向 back：请求 /sign-up
            } else {
                sql = 'INSERT INTO blog.user(username, password, avatar) VALUE(?, ?, ?)';
                db.pool.query(sql, [username, encryptedPassword, fileName], (err, reulsts, fields) => {
                    if (err) {
                        req.flash('error', 'Sign up failed.');
                        return res.redirect('back');
                    }
                    if (reulsts.affectedRows === 1) {
                        req.flash('success', 'Sign up successful, sign in please.');
                        res.redirect('/sign-in');
                    } else {
                        req.flash('error', 'Sign up failed.');
                        res.redirect('back');
                    }
                });
            }
        });
    });

    app.post('/signIn', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;

        let sql = 'SELECT * FROM blog.user WHERE username = ?';
        db.pool.query(sql, [username], (err, results, fields) => {
            if (err) {
                // err save in log...
                req.flash('error', 'Sign in failed.');
                return res.redirect('back');
            }
            if (results.length === 1) {
                let encryptedPassword = results[0].password;
                if (bcrypt.compareSync(password, encryptedPassword)) {
                    req.session.username = results[0].username;
                    req.session.userId = results[0].id;
                    req.session.avatar = results[0].avatar;
                    // return: Error: Can't set headers after they are sent.
                    return res.redirect('/blog/' + username);
                }
            }
            req.flash('error', 'Invalid username or password.');
            res.redirect('back');
        })
    })
};