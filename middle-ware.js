/*
 * https://github.com/thu/node-blog-demo
 *
 * Copyright mingfei.net@gmail.com 
 * Released under the MIT license 
 * 
 * Date: 2017/12/10 15:36
 */

// middleware 中间件
// software

const express = require('express');

let app = express();

function middlewareA(req, res, next) {
    console.log('A: before...');
    next();
    console.log('A: after...');
}

function middlewareB(req, res, next) {
    console.log('B: before...');
    next();
    console.log('B: after...');
}

app.use(middlewareA);

app.get('/', (req, res, next) => {
    res.end('hello 81...');
    console.log('get: before...');
    next();
    console.log('get: after...');
});

app.use(middlewareB);

app.listen(81);