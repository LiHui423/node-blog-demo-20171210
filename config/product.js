/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/10 17:05
 */

// 线上环境的配置文件
// config 配置
module.exports = {
    port: 80,
    mysql_host: '127.0.0.1',
    mysql_port: 3306,
    mysql_user: 'root',
    mysql_password: '',
    mysql_database: 'blog_online',
    mysql_connectionLimit: 100
};