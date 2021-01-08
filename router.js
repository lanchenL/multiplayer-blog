// 路由依赖于express
var express = require('express')

// 导入user.js
var User = require('./db/user')
// var News = require('./db/new')
var Topic = require('./db/topic')

// 使用md5来进行密码的加密
var md5 = require('blueimp-md5')
const user = require('./db/user')

// 导入路由
var router = express.Router()
// 设置路由
router.get('/', function (req, res) {
  console.log(req.session.user);
  
    Topic.find(function(err, topics) {
      if(err) {
        console.log(err);
      }
      res.render('index.html', {
        user: req.session.user,
        topics: topics
      })
      
    })
  
})

router.get('/login', function(req, res) {
  res.render('login.html')
})
router.post('/login', function (req, res ) {
  // 思路： 1 获取表单数
  //   2 查询数据库的用户名和密码是否正确
  //   3 发送响应数据
  var body = req.body
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if(err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    if(!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid'
      })
    }
    req.session.user = user
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/register', function(req, res) {
  res.render('register.html')
})
router.post('/register', async function (req, res ) {
  // 思路：
  // 1 获取表单获取到的数据 req.body
  // 2 操作数据库
  //   判断用户是否存在，存在了不许注册，不存在则可以注册
  // 3 发送响应
  // console.log(req.body);

  // 之前的做法
  // var body = req.body;
  // 查询是否有邮箱和昵称重复
  // User.findOne({
  //   $or: [
  //     {
  //       email: body.email
  //     },
  //     {
  //       nickname: body.nickname
  //     }
  //   ]
  // }, function(err, data) {
  //   if(err) {
  //     return res.status(500).json({
  //       err_code: 500,
  //       message: 'server error'
  //     })
  //   }
    // if(data) {
    //   return res.status(200).json({
    //     err_code: 1,
    //     message: 'email or nickname already exists'
    //   })
    // }
    // body.password = md5(md5(body.password))
    // new User(body).save(function(err, data) {
    //   if(err) {
    //     return res.status(500).json({
    //       err_code: 500,
    //       message: 'server error'
    //     })
    //   }
    //   // express提供了一个.json方法，让json数据转化成字符串对象（因为ajax返回的数据时是son）
    //   // console.log('ok');
    //   res.status(200).json({
    //     err_code: 0,
    //     message: 'OK'
    //   })
    // })
  // })

  // 上方的$or的改良版，也就是mongoDB使用的或运算符
  var body = req.body
  try {
    if(await User.findOne({ email: body.email})) {
        return res.status(200).json({
          err_code: 1,
          message: '邮箱已存在'
        })
      }
    if(await User.findOne({nickname: body.nickname})) {
      return res.status(200).json({
        err_code: 2,
        message: '昵称已存在'
      })
    }
    body.password = md5(md5(body.password))

    await new User(body).save(function(err, user)  {
      if(err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Internal error'
        })
      }
      req.session.user = user
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  } catch(err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})
router.get('/logout', function (req, res) {
  // 清楚登录状态
  req.session.user = null;
  // 重定向带登录页
  res.redirect('/login')
})
// 发表留言区
// router.get('/topics/new', function(req, res ) {
//   res.render('topic/new.html', {
//     user: req.session.user
//   })
// })
// router.post('/topics/new', function(req, res) {
//   console.log(req.body, 'user为:',user);
//   new News(req.body).save(function(err, news) {
//     if(err) {
//       return res.status(500).send(err.message)
//     }
//     res.redirect('/')
//   })
// })
// 导出路由
module.exports = router;