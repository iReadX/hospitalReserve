let tableName = 'numbers'; // 表名
let admin = {
    // 统计
    totlal: `SELECT COUNT(?) AS total FROM ${tableName}`,
    // 查询所有
    queryAll: `SELECT ?? from ${tableName} ORDER BY id DESC limit ? offset ?`,
    // 添加
    add: `INSERT INTO ${tableName}(userName,password,sex,deviceId,deviceSys,addTime,userId) VALUES(?, ?, ?, ?, ?, ?, ?)`,
    // 查询
    query: `SELECT ?? FROM ${tableName} WHERE ? LIMIT 1`,
    // 根据条件更新数据
    update: `UPDATE ${tableName} SET ? WHERE ?`,
    // 删除数据
    del: `delete from ${tableName} where ?`
};

module.exports = admin;
