var express = require('express')
// var app = require('http')
var fs = require('fs')
var path = require('path')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))    // 默认的就是views目录了，配置好以后修改

app.get('/', function(req, res ) {
  res.render('index.html', {
    name: '张三'
  })
})

app.listen('3000', function() {
  console.log('服务启动成功。点击访问：127.0.0.1:3000');
})
