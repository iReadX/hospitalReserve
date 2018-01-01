let sql = require('../../sql/admin');
let mySql = require('../../models/mySql');
let keyMap = require('../../util/keyMap');

const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

let util = require('../../util/index');

const router = {
    // 登录
    '/login': [
        [
            check('userName').not().isEmpty().withMessage(keyMap.adminUser['userName'] + keyMap.publicStr.notEmpty).trim(),
            check('password').not().isEmpty().withMessage(keyMap.adminUser['password'] + keyMap.publicStr.notEmpty).trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            const resData = matchedData(req);
            mySql.query(sql.queryUser,
                [['name', 'avator', 'userId', 'userName', 'password', 'access', 'lastTime', 'lastIp'], {userName: resData.userName}],
                {type: keyMap.logType.userLogin, req}
            ).then(rows => {
                if (rows.length) {
                    if (util.eStr(resData.password) !== rows[0].password) {
                        res.json({code: 1, msg: '密码错误', data: {}})
                    } else {
                        let {name, avator, userId, userName, access, lastTime, lastIp} = rows[0];
                        req.session.user = {userId, access};
                        res.json({
                            code: 0,
                            msg: '登录成功',
                            data: {name, avator, userId, access, userName, lastTime, lastIp}
                        });
                        // 更新登录时间和ip
                        mySql.update(sql.updateUserById,
                            [{lastIp: util.getRealIp(req), lastTime: util.getNow()}, userId],
                            {userId});
                    }
                } else {
                    res.json({code: 1, msg: '帐号不存在', data: {}})
                }
            });
        }
    ],
    // 注册
    '/register': [
        [
            check('name').not().isEmpty().withMessage(keyMap.adminUser['name'] + keyMap.publicStr.notEmpty).trim(),
            check('userName').not().isEmpty().withMessage(keyMap.adminUser['userName'] + keyMap.publicStr.notEmpty).trim(),
            check('password').not().isEmpty().withMessage(keyMap.adminUser['password'] + keyMap.publicStr.notEmpty).trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: '', errors: errors.mapped()})
            }
            const resData = matchedData(req);
            // 帐号已经存在
            mySql.query(sql.queryUser,
                ['userName', {userName: resData.userName}],
                {type: keyMap.logType.userSelect, req}
            ).then(rows => {
                if (rows.length) {
                    res.json({
                        code: 1,
                        msg: '注册失败，帐号已经存在',
                        data: {}
                    })
                } else {
                    // 不存在就入库(默认是非超级管理员)
                    mySql.insert(sql.addUser,
                        [resData.name, resData.userName, util.eStr(resData.password), 1, util.getNow(), util.getRealIp(req)],
                        {type: keyMap.logType.userRegister, req}
                    ).then(rows => {
                        if (rows.insertId) {
                            res.json({
                                code: 0,
                                msg: '注册成功',
                                data: {}
                            })
                        } else {
                            res.json({
                                code: 1,
                                msg: '注册失败',
                                dat: {}
                            })
                        }
                    })
                }
            })
        }
    ],
    // 退出登录
    '/logout': (req, res) => {
        if (req.session) {
            req.session.destroy()
        }
        res.json({code: 1, msg: '退出成功', data: {}});
    }
};

module.exports = router;
