var express = require('express');
var router = express.Router();

var adminUser = require('./adminUser');
var numbers = require('./number');

// 该路由使用的中间件
router.use((req, res, next) => {
    if (!req.session || !req.session.user || !req.session.user.userId) {
        return res.json({code: 10, msg: '帐号信息异常，请重新登录', data: {}})
    }
    next()
});

let all = [adminUser, numbers];
let mod = ['', '/numbers'];

all.map((item, index) => {
    for (let url in item) {
        router.post(mod[index] + url, item[url])
    }
});

module.exports = router;
