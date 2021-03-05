var express = require('express')
var User = require('../db/user')
var path = require('path')

var fs = require('fs')


var Topic = require('../db/topic')

var md5 = require('blueimp-md5')
const { route } = require('./topic')
var formidable = require('formidable');
const fun = require('../db/fun')

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
    // User.findById({
    //   _id: req.session.user._id
    // }, function(err, user) {
    //   if(err) {
    //     return next(err);
    //   }
    //   console.log('topic的user为：', user);
    //   req.session.user = user;
    // })
    res.status(200).json({
      err_code: 0,
      message: '改修的信息提交成功'
    })
  })
})

// 修改头像
router.post('/settings/upavatar', function(req, res, next) {
  console.log('进入修改头像服务中');
  console.log(req.session.user._id);

  var form = new formidable.IncomingForm();
  // var a = path.normalize(__dirname+'/'+"../public/upload/brand");
  // console.log(a);

    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = path.normalize(__dirname + '/' + '../public/upload/brand'); // normalize使路径规范化
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制 2m
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    var date = new Date();
    var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
    console.log(time);
    form.parse(req, function (err, fields, files) {
        // console.log(files);
        var file = files.avatar;
        let picName = time + path.extname(file.name);  //extname取文件的后缀名
        fs.rename(file.path, form.uploadDir + picName, function (err) {
            // if (err) return res.send({ "error": 403, "message": "图片保存异常！" });
            if(err) {
              next(err);
            }
            User.findById(req.session.user._id, function(err, user) {
              if(err) {
                next(err);
              }
              // console.log(user);
              user.avatar = '/public/upload/' +  'brand' + picName;
              console.log(user.avatar);
              User.updateOne({
                _id: req.session.user._id
              }, {
                avatar: user.avatar
              }, function(err, message) {
                if(err) {
                  next(err);
                }
                console.log('更新头像成功!!');
                let message1 = message
                // console.log(user.avatar);
                // 更新之前发布过评论的头像
                Topic.find(function(err, message1) {
                  if(err) {
                    return next(err);
                  }
                  console.log('message1', message1, typeof(message1));
                  message1.forEach((item) => {
                    Topic.update({
                      "publisher_id": req.session.user._id
                    }, {
                      $set: {"publisher_avatar": user.avatar}
                    }, {
                      multi:true  //全部替换
                    }, function(err) {
                      if(err) {
                        console.log(err);
                        console.log('没有发布过评论');
                        return next(err)
                      }
                      console.log('全部更新头像！！');
                    })
                  })
                })
                // Topic.update({
                //   _id: req.session.user._id
                // },{
                //   publisher_avatar: user.avatar
                // },
                // {multi:true}, function(err) {
                //   if(err) {
                //     console.log(err);
                //   }
                //   console.log('更新评论的头像');
                // })
              })
            })
            res.send({ 
              "picAddr":  picName , 
              "filePath": '/public/upload/' +  'brand' + picName,
              "message": 'avatar is update success!',
              "err_code": 0
          });
        });
    });
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

router.get('/verify', function(req, res, next) {
  console.log('进入验证账号和昵称页面');
  res.render('verify.html')
})

// 验证账号和昵称
router.post('/verify', function(req, res, next) {
  console.log(req.body);
  let body = req.body;
  User.find({
    email: body.email,
    nickname: body.nickname
  }, function(err, user) {
    if(err) {
      return next(err);
    }
    console.log(user);
    if(user.length !== 0) {
      console.log('找到此人，验证信息成功');
      res.status(200).json({
        err_code: 0,
        message: 'person message verify is succeed'
      })
    }else {
      console.log('未找到此人');
      res.status(200).json({
        err_code: 1,
        message: 'person message verify is no succeed'
      })
    }
    
  })
})

// 进入到设置密码页面
router.get('/reset', function(req, res, next) {
  res.render('resetPassword.html', {
    email: req.query.email
  })
})
// 重置密码
router.post('/savePassWord', function(req, res, next) {
  let body = req.body;
  
  console.log(body);
  if(body.npassword === body.cpassword) {
    let password = md5(md5(body.cpassword));
    User.updateOne({
      email: body.email
    }, {
      password: password
    }, function(err) {
      if(err) {
        return next(err);
      }
      console.log('更新密码成功');
      res.status(200).json({
        err_code: 0,
        message: 'update password is succeed'
      })
    })
  }else {
    console.log('新旧密码不一致');
    res.status(200).json({
      err_code: 1,
      message: '新旧密码不一致'
    })
  }
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