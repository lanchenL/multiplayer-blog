var express = require('express')
var User = require('../db/user')

var md5 = require('blueimp-md5')

var router = express.Router()

// 设置用户的信息
router.get('/settings/profile', function(req, res, next) {
  console.log('设置页面进入');
  var body = req.session.user;
  if(body) {
    User.findOne({
      email: body.email
    }, function(err, quser) {
      console.log('查询到此人');
      console.log(quser);
      if(err) {
        next(err)
      }
      res.render('./settings/profile.html', {
        user: quser
      })
    })
  }else {
    res.redirect('/login')
  }
})

router.post('/settings/profile', function(req, res, next) {
  console.log('修改信息已提交');
  var body = req.body;
  console.log(body);
  User.findOneAndUpdate({
    email: body.email
  }, body, function(err, data) {
    console.log('更新信息完成', data);
    if(err) {
      next(err)
    }
    res.status(200).json({
      err_code: 0,
      message: '改修的信息提交成功'
    })
  })
})

router.get('/settings/admin', function(req, res, next) {
  console.log('进入账户设置');
  var body = req.session.user;
  if(body) {
    User.findOne({
      email: body.email
    }, function(err, quser) {
      if(err) {
        next(err)
      }
      res.render('./settings/admin.html', {
        user: quser
      })
    })
  }else {
    res.redirect('/login')
  }
})

router.post('/settings/admin', function(req, res, next) {
  console.log('提交密码成功');
  var suser = req.session.user;
  var body = req.body;
  console.log(body);
  User.findOne({
    email: suser.email
  }, function(err, user) {
    if(err) {
      next(err)
    }
    console.log('查询到此用户');
    console.log(user);
    if(user.password != md5(md5(body.opassword))) {
      return res.status(200).json({
        err_code: 1,
        message: 'opassword is issue'
      })
    }
    if(user.password == body.npassword || user.password == body.cpassword) {
      return res.status(200).json({
        err_code: 2,
        message: 'this password is Cannot be the same as the old password'
      })
    }
    if(body.npassword != body.cpassword) {
      return res.status(200).json({
        err_code: -1,
        message: 'The two passwords do not match'
      })
    }
    User.findOneAndUpdate({
      email: suser.password
    }, {
      password: body.npassword
    }, function(err, data) {
      if(err) {
        next(err)
      }
      res.status(200).json({
        err_code: 0,
        message: 'the password is change ok'
      })
    })
  })
})
module.exports = router