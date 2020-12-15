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
    if(user.password == md5(md5(body.npassword)) || user.password == md5(md5(body.cpassword))) {
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
      email: suser.email
    }, {
      password: md5(md5(body.npassword))
    }, function(err, data) {
      if(err) {
        next(err)
      }
      console.log('data为', data)
      res.status(200).json({
        err_code: 0,
        message: 'the password is change ok'
      })
    })
  })
  
})

// 注销按钮
router.get('/logoff', function(req, res, next) {
  console.log('删除');
  var user = req.session.user
  var body = req.query;
  console.log(body.confirm, typeof(body.confirm), body.confirm == true);
  if(body.confirm == 'true') {
    User.deleteOne({
      email: user.email
    }, function(err, message) {
      if(err) {
        next(err)
      }
      req.session.destroy();
      res.status(200).json({
        err_code: 0,
        message:  'delete is ok'
      })
    })
  }else {
    res.status(200).json({
      err_code: 1,
      message: 'delete is false'
    })
  }
  
})
module.exports = router