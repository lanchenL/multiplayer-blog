var express = require('express')
// var app = require('http')
var fs = require('fs')
var path = require('path')

var bodyParser = require('body-parser')
var session = require('express-session')

// 导入路由js
var router = require('./router')
var topic = require('./routes/topic')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))    // 默认的就是views目录了，配置好以后修改

// 配置body-parser插件，用来获取post的数据表单提交
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 使用配置express-session插件
app.use(session({
  secret: 'keyboard cat',  // 配置加密字符串，会在原有的加密的基础上和这个字符串拼接起来进行加密，增加安全性
  resave: false,
  saveUninitialized: true  // 当为true时，无论你是否使用session，都会给你分配一把钥匙
}))

// 使用路由,进行挂载
app.use(router)
app.use(topic)

//配置一个处理404得中间件
app.use(function (req, res, next) {
  res.render('404.html')
})

//配置全局错误处理中间件
app.use(function (err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message  
  })
})

app.listen('3000', function() {
  console.log('服务启动成功。点击访问： http://127.0.0.1:3000');
})
