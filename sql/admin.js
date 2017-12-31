let tableName = 'admin'; // 表名
let admin = {
    // 查询所有
    queryAll: `SELECT ? from ${tableName} limit ? offset ?`,
    // 添加管理员
    addUser: `INSERT INTO ${tableName}(name,userName,password,access,addTime,addIp) VALUES(?, ?, ?, ?, ?, ?)`,
    // 根据登录帐号查询管理员
    queryUser: `SELECT ?? FROM ${tableName} WHERE ? LIMIT 1`,
    // 根据id更新管理员信息
    updateUserById: `UPDATE ${tableName} SET ? WHERE userId=?`,
};

module.exports = admin;
