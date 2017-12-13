/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/3 9:56
 */

const express = require('express');
let app = express();

// 中间件的引入
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const upload = require('express-fileupload');
const config = require('config-lite')(__dirname);

// 中间件的配置
app.engine('html', ejs.__express);
app.set('view engine', '.html'); // .ejs
// app.set('views', path.join(__dirname, '/views')); // 约定

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'node blog',
    resave: true,
    saveUninitialized: true
})); // session before flash ***
app.use(flash());
app.use(upload());

// 导入模块的路由
require('./routes/index')(app);
require('./routes/user')(app);
require('./routes/blog')(app);
require('./routes/post')(app);

console.log(process.env.NODE_ENV);
console.log(config.port);

app.listen(config.port);