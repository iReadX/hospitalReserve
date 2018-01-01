const adminUser = {
    name: '昵称',
    userName: '帐号',
    password: '密码',
    newPassword: '新密码',
};

const publicStr = {
    notEmpty: '不能为空'
};

const logType = {
    userLogin: 'userLogin', // 用户登录
    userSelect: 'userSelect', // 用户查询
    userRegister: 'userRegister', // 用户注册
    userCheckPassWord: 'userCheckPassWord', // 用户修改密码
    userUpdateInfo: 'userUpdateInfo', // 用户更新信息
    total: 'total', // 统计
    list: 'list', // 列表
    insert: 'insert', // 插入数据
    update: 'update', // 更新数据
    check: 'check', // 检测数据
    select: 'select', // 数据查询
    delete: 'delete', // 删除数据
};

module.exports = {
    adminUser,
    publicStr,
    logType
};
