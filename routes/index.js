var express = require('express');
var router = express.Router();

router.all('/*', function (req, res) {
    res.status(404).json({code: 1, msg: '暂无访问权限', data: {}})
});

module.exports = router;
