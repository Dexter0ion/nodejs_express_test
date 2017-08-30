var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mysql = require('mysql');

var index = require('./routes/index');
var users = require('./routes/users');
var table1 = require('./routes/table1');
var tableDB = require('./routes/tableDB');
var regisadmin = require('./routes/regisadmin');
var app = express();
//aa
// view engine setup
//设置模板引擎为ejs
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);

app.use('/users', users);
app.use('/table1.html', table1);
app.use('/tableDB', tableDB);
app.use('/regisadmin', regisadmin);

/*
app.use('/', routes);  // 即为为路径 / 设置路由
app.use('/users', users); // 即为为路径 /users 设置路由
app.use('/login',routes); // 即为ss为路径 /login 设置路由
app.use('/register',routes); // 即为为路径 /register 设置路由
app.use('/home',routes); // 即为为路径 /home 设置路由
app.use("/logout",routes); // 即为为路径 /logout 设置路由
*/
//获取前台表单信息
app.post('/test', function (req, res) {
  console.log(req.body.name);
  console.log(req.body.tel);
});

app.post('/test2', function (req, res) {
  //获取前台数据
  console.log(req.body.memberName);
  console.log(req.body.memberSchoolNumber);
  console.log(req.body.memberClassName);
  console.log(req.body.memberTel);
  console.log(req.body.memberQQ);
  console.log(req.body.memberSex);
  console.log(req.body.memberTeam);
  console.log(req.body.memberMessage);

  var memberName = req.body.memberName;
  var memberSchoolNumber = req.body.memberSchoolNumber;
  var memberClassName = req.body.memberClassName;
  var memberTel = req.body.memberTel;
  var memberQQ = req.body.memberQQ;
  var memberSex = req.body.memberSex;
  var memberTeam = req.body.memberTeam;
  var memberMessage = req.body.memberMessage;
  //同步数据库

  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: '47.88.16.241',
    user: 'admin',
    password: 'adminpassword',
    database: 'regisdb',
    port: '3306',
    charset: 'UTF8_GENERAL_CI'
  });
  connection.connect();

  /*
 CREATE TABLE `regisdb`.`tblMemberRegisInfo` (
  `memberId` INT NOT NULL AUTO_INCREMENT,
  `memberName` VARCHAR(45) NULL,
  `memberSchoolNumber` VARCHAR(45) NULL,
  `memberClassName` VARCHAR(45) NULL,
  `memberTel` VARCHAR(45) NULL,
  `memberQQ` VARCHAR(45) NULL,
  `memberSex` VARCHAR(45) NULL,
  `memberTeam` VARCHAR(45) NULL,
  `memberMessage` VARCHAR(1000) NULL,
  `tblMemberRegisInfocol` VARCHAR(45) NULL,
  PRIMARY KEY (`memberId`));

*/
  var usr = {
    memberName: req.body.memberName,
    memberSchoolNumber: req.body.memberSchoolNumber,
    memberClassName: req.body.memberClassName,
    memberTel: req.body.memberTel,
    memberQQ: req.body.memberQQ,
    memberSex: req.body.memberSex,
    memberTeam: req.body.memberTeam,
    memberMessage: req.body.memberMessage,
  };
  connection.query('insert into tblMemberRegisInfo set ?', usr, function (err, result) {
    if (err) throw err;
    console.log('inserted complete');
    console.log(result);
    console.log('\n');
  });

  //显示查询数据
  connection.query('select * from tblMemberRegisInfo', function (err, rows, fields) {
    if (err) throw err;
    console.log('selected after deleted');
    for (var i = 0, usr; usr = rows[i++];) {
      console.log('user name=' + usr.memberName);
    }
    console.log('\n');
  });

  connection.end();
});

//获取前台管理员登陆数据

app.post('/regisadmin', function (req, res) {
  console.log(req.body.adminname);
  console.log(req.body.adminpassword);
});

app.get('/adminGetdata', function (req, res) {
  res.send('hello world');
});
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
