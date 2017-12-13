/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/3 17:08
 */

const mysql = require('mysql');
const config = require('config-lite')(__dirname);

module.exports.pool = mysql.createPool({
    host: config.mysql_host,
    user: config.mysql_user,
    password: config.mysql_password,
    database: config.mysql_database,
    connectionLimit: config.mysql_connectionLimit,

    dateStrings: 'date'
});