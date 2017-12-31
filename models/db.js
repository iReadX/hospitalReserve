let dbConfig = require('../config/db'),
    mysql = require('mysql');

/**
 * 数据库连接
 * @type {Connection}
 */
let hospitalreserve = mysql.createPool(dbConfig.hospitalreserve);

exports.hospitalreserve = hospitalreserve;
