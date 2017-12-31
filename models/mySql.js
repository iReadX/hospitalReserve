let db = require('./db');
let util = require('../util');

/**
 * 数据库连接
 * @param call
 * @returns {*}
 */
let dbCon = (call) => db.hospitalreserve.getConnection((err, connection) => {
    if (err) throw err;
    call(connection)
});

/**
 * 语句执行sql
 * @param queryStr
 * @param queryParams
 * @param options
 * @returns {Promise<any>}
 */
let dbQuery = (queryStr, queryParams = [], options = {type: '', req: '', userId: ''}) => {
    return new Promise((resolve, reject) => dbCon(con => {
        console.log('sql--->', queryStr)
        // 插入日志
        let type = options.type || 'default';
        let userId = options.userId || '';
        let originalUrl = '';
        let method = '';
        if (options.req) {
            originalUrl = options.req.originalUrl;
            method = options.req.method;
        }
        con.query(
            "INSERT INTO log(userId,url,method,sqlStr,sqlParams,logType,ip,TIME) VALUES(?,?,?,?,?,?,?,?)",
            [userId, originalUrl.toString(), method.toString(), queryStr.toString(), JSON.stringify(queryParams), type, options.req && util.getRealIp(options.req) || '0.0.0.1', util.getNow()]
        );
        // 执行sql语句超过20秒则超时
        con.query({sql: queryStr, timeout: 20000}, queryParams, (err, rows, fields) => {
            con.release();
            if (err) {
                reject(err)
                throw err
            }
            resolve(rows)
        })
    }))
};

let mysql = {
    /**
     * 查询
     * @param queryStr 查询语句
     * @param queryParams 查询语句参数
     * @param options 其他参数
     */
    query: (queryStr, queryParams, options) => dbQuery(queryStr, queryParams, options),
    /**
     * 插入
     * @param insertStr 插入语句
     * @param insertParams 插入语句参数
     * @param options 其他参数
     */
    insert: (insertStr, insertParams, options) => dbQuery(insertStr, insertParams, options),
    /**
     * 更新
     * @param updateStr 更新语句
     * @param updateParams 更新语句参数
     * @param options 其他参数
     */
    update: (updateStr, updateParams, options) => dbQuery(updateStr, updateParams, options),
    /**
     * 删除
     * @param deleteStr 删除语句
     * @param deleteParams 删除语句参数
     * @param options 其他参数
     */
    delete: (deleteStr, deleteParams, options) => dbQuery(deleteStr, deleteParams, options),
};

module.exports = mysql;
