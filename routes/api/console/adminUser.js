let sql = require('../../../sql/admin');
let mySql = require('../../../models/mySql');

const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

let util = require('../../../util/index');
let keyMap = require('../../../util/keyMap');

const router = {
    // 获取登录用户的信息
    '/getUserInfo': (req, res) => {
        let {userId = ''} = req.session.user;
        mySql.query(sql.queryUser,
            [['name', 'avator', 'userId', 'userName', 'access', 'lastTime', 'lastIp'], {userId}],
            {type: keyMap.logType.userSelect, req, userId}
        ).then(rows => {
            if (rows.length) {
                res.json({code: 0, msg: '帐号信息获取成功', data: rows[0]})
            } else {
                res.json({code: 1, msg: '帐号不存在', data: {}})
            }
        });
    },
    // 密码验证
    '/checkPass': [
        [
            check('password').not().isEmpty().withMessage(keyMap.adminUser['password'] + keyMap.publicStr.notEmpty).trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            const resData = matchedData(req);
            let {userId = ''} = req.session.user;
            mySql.query(sql.queryUser,
                ['password', {userId}],
                {type: keyMap.logType.userCheckPassWord, req, userId}
            ).then(row => {
                if (row.length) {
                    if (row[0].password === util.eStr(resData.password)) {
                        res.json({code: 0, msg: '密码正确', data: {}})
                    } else {
                        res.json({code: 1, msg: '密码错误', data: {}})
                    }
                } else {
                    res.json({code: 1, msg: '帐号不存在', data: {}})
                }
            })
        }
    ],
    // 更新帐号信息
    '/updateUserInfo': [
        [
            check('name').not().isEmpty().withMessage(keyMap.adminUser['name'] + keyMap.publicStr.notEmpty).trim(),
            check('userName').not().isEmpty().withMessage(keyMap.adminUser['userName'] + keyMap.publicStr.notEmpty).trim(),
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({code: 1, msg: '', errors: errors.mapped()})
            }
            const resData = matchedData(req);
            let {userId = ''} = req.session.user;
            // 帐号已经存在
            mySql.query(sql.queryUser,
                [['userName', 'userId'], {userName: resData.userName}],
                {type: keyMap.logType.userSelect, req, userId}
            ).then(rows => {
                if (rows.length && rows[0].userId !== userId) {
                    res.json({code: 1, msg: '帐号已经存在，请重新输入新帐号', data: {}})
                } else {
                    // 不存在就更新
                    mySql.update(sql.updateUserById,
                        [{name: resData.name, userName: resData.userName}, userId],
                        {type: keyMap.logType.userUpdateInfo, req, userId}
                    ).then(rows => {
                        if (rows.affectedRows) {
                            res.json({code: 0, msg: '修改成功', data: {}});
                        } else {
                            res.json({code: 1, msg: '修改失败', data: {}});
                        }
                    })
                }
            })
        }
    ]
};

module.exports = router;
