let crypto = require('crypto');
/**
 * 获取请求的真实IP
 * @param req
 * @returns ip
 *
 * NG代理还行配置
 * location /svc/ {
                proxy_pass http://192.168.1.111:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
 */
const getRealIp = (req) => {
    let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    return ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0] || '0.0.0.1'
};

/**
 * 获取当前时间戳
 * @returns {number}
 */
const getNow = () => new Date().getTime();

/**
 * 加密
 * @param str
 * @returns {string}
 */
const eStr = (str) => {
    let start = 'xfc';
    let end = 'bsa';
    return crypto.createHash('md5').update(start + str + end).digest('hex')
};

module.exports = {
    getRealIp, getNow, eStr
};
