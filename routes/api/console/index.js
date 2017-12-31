var express = require('express');
var router = express.Router();

var util = require('../../../util');

var adminUser = require('./adminUser');

// 该路由使用的中间件
router.use((req, res, next) => {
    if (!req.session || !req.session.user || !req.session.user.userId) {
        return res.json({code: 10, msg: '帐号信息异常，请重新登录', data: {}})
    }
    next()
});

for (let url in adminUser) {
    router.post(url, adminUser[url])
}

module.exports = router;
