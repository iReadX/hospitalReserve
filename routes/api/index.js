var express = require('express');
var router = express.Router();

var util = require('../../util');

var publicRou = require('./public');

// 该路由使用的中间件
router.use((req, res, next) => {
    console.log('Time: ', util.getNow(), 'ip:', util.getRealIp(req));
    next()
});

for (let url in publicRou) {
    router.post(url, publicRou[url])
}

module.exports = router;
