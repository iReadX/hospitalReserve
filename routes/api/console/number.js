let sql = require('../../../sql/numbers');
let mySql = require('../../../models/mySql');

const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

let util = require('../../../util/index');
let keyMap = require('../../../util/keyMap');

const router = {
    '/add': [
        [
            check('userName').not().isEmpty().withMessage('手机号' + keyMap.publicStr.notEmpty).trim(),
            check('password').not().isEmpty().withMessage('密码' + keyMap.publicStr.notEmpty).trim(),
            check('sex').trim(),
            check('deviceId').trim(),
            check('deviceSys').trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            let {userName, password, sex = '', deviceId = '', deviceSys = ''} = matchedData(req);
            let {userId = ''} = req.session.user;
            let deviceSysArr = ['MIX', 'MAX', '4S', '5S', '6S', '6Plus'];
            if (!deviceId) {
                // 随机生成设备id
                deviceId = (String.fromCharCode(97 + (Math.round(Math.random() * 9 + 1))) + Math.random() * 100000000000000000).substring(0, 16);
            }
            if (!deviceSys) {
                // 随机生成设备系统
                deviceSys = deviceSysArr[Math.round(Math.random() * deviceSysArr.length - 1)] || deviceSysArr[0];
            }
            mySql.query(sql.query,
                ['userName', {userName}],
                {type: keyMap.logType.check, req, userId}
            ).then(row => {
                if (row.length) {
                    return res.json({code: 1, msg: '添加失败，手机号已经存在', data: {}})
                }
                mySql.insert(sql.add,
                    [userName, password, sex, deviceId, deviceSys, util.getNow(), userId],
                    {type: keyMap.logType.insert, req, userId}
                ).then(rows => {
                    if (rows.insertId) {
                        res.json({code: 0, msg: '添加成功', data: {}})
                    } else {
                        res.json({code: 1, msg: '添加失败', dat: {}})
                    }
                })
            })
        }
    ],
    '/get': [
        [
            check('id').not().isEmpty().withMessage('ID' + keyMap.publicStr.notEmpty).trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            const {id} = matchedData(req);
            const {userId = ''} = req.session.user;

            mySql.query(sql.query,
                [['id', 'userName', 'password', 'sex', 'deviceId', 'deviceSys'], {id}],
                {type: keyMap.logType.select, req, userId}
            ).then(rows => {
                if (rows.length) {
                    res.json({code: 0, msg: '数据获取成功', data: rows[0]})
                } else {
                    res.json({code: 10, msg: '数据不存在', data: {}})
                }
            });
        }
    ],
    '/edit': [
        [
            check('userName').not().isEmpty().withMessage('手机号' + keyMap.publicStr.notEmpty).trim(),
            check('password').not().isEmpty().withMessage('密码' + keyMap.publicStr.notEmpty).trim(),
            check('sex').trim(),
            check('deviceId').trim(),
            check('deviceSys').trim(),
            check('id').trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            let {userName, password, sex = '', deviceId = '', deviceSys = '', id} = matchedData(req);
            let {userId = ''} = req.session.user;
            let deviceSysArr = ['MIX', 'MAX', '4S', '5S', '6S', '6Plus'];
            if (!id) {
                return res.json({code: 1, msg: '数据不存在', data: {}})
            }
            if (!deviceId) {
                // 随机生成设备id
                deviceId = (String.fromCharCode(97 + (Math.round(Math.random() * 9 + 1))) + Math.random() * 100000000000000000).substring(0, 16);
            }
            if (!deviceSys) {
                // 随机生成设备系统
                deviceSys = deviceSysArr[Math.round(Math.random() * deviceSysArr.length - 1)] || deviceSysArr[0];
            }
            mySql.query(sql.query,
                [['userName', 'id'], {userName}],
                {type: keyMap.logType.check, req, userId}
            ).then(row => {
                if (row.length && row[0].id !== id) {
                    return res.json({code: 1, msg: '修改失败，手机号已经存在', data: {}})
                }
                mySql.update(sql.update,
                    [{userName, password, sex, deviceId, deviceSys, updateTime: util.getNow()}, id],
                    {type: keyMap.logType.update, req, userId}
                ).then(rows => {
                    if (rows.affectedRows) {
                        res.json({code: 0, msg: '修改成功', data: {}})
                    } else {
                        res.json({code: 1, msg: '修改失败', dat: {}})
                    }
                })
            })
        }
    ],
    '/del':[
        [
            check('id').not().isEmpty().withMessage('ID' + keyMap.publicStr.notEmpty).trim(),
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            const {id} = matchedData(req);
            const {userId = ''} = req.session.user;

            mySql.delete(sql.del,
                {id},
                {type: keyMap.logType.delete, req, userId}
            ).then(rows => {
                if (rows.affectedRows) {
                    res.json({code: 0, msg: '删除成功', data: {}})
                } else {
                    res.json({code: 1, msg: '删除失败', data: {}})
                }
            });
        }
    ],
    '/list': [
        [
            check('current').isNumeric().withMessage('页码不正确').trim()
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({code: 1, msg: errors.mapped(), data: {}})
            }
            const resData = matchedData(req);
            let {userId = ''} = req.session.user;
            if (isNaN(resData.current)) {
                return res.json({code: 0, msg: '', data: []});
            }
            mySql.query(sql.totlal, 'id', {type: keyMap.logType.total, req, userId}).then(row => {
                let pageSize = 20; // 每页显示20条数据
                let current = resData.current; // 第几页
                let total = row[0].total; // 数据总数
                let offset = (current - 1) * pageSize;
                if (!total || (offset > total)) {
                    return res.json({code: 0, msg: '', data: [], pageSize, current, total});
                }
                mySql.query(sql.queryAll,
                    [
                        ['id', 'userName', 'password', 'sex', 'deviceId', 'deviceSys', 'updateTime', 'addTime', 'userId'],
                        pageSize, offset
                    ],
                    {type: keyMap.logType.list, req, userId}
                ).then(rows => {
                    res.json({code: 0, msg: '', data: rows, pageSize, current, total});
                })
            });
        }
    ],
};

module.exports = router;
