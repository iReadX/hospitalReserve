var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var index = require('./routes/index');
var api = require('./routes/api');
var console = require('./routes/api/console');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        pass: 'test123',
        ttl: 24 * 60 * 60 * 1000 // Session的有效期为24小时
    }),
    resave: true, // 是指每次请求都重新设置session cookie，假设cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false, // 指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    secret: 'hospital', // 签名字符串
    cookie: {maxAge: 24 * 60 * 60 * 1000} // 24小时
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/console', console);
app.use('/api', api);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
