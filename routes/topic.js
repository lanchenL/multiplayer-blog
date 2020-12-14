var express = require('express')

var Topic = require('../db/topic')
var Comment = require('../db/comment')
var User = require('../db/user') 
var Funs = require('../db/fun')

var router = express.Router()

router.get('/topics/new', function(req, res) {
  var body = req.session.user
  console.log(body,'啦啦啦啦');
  res.render('topic/new.html', {
    user: body
  })

})
router.post('/topics/new', function(req, res) {
  var body = req.body
  // new Topic(body)
  console.log('body为：', body);
  new Topic(body).save(function(err, TopicData) {
    if(err) {
      return res.status(500).json({
        err_code: 500,
        message: 'save error'
      })
    }
    res.status(200).json({
      err_code: 0,
      message: 'save is OK'
    })
  })
})
router.get('/topics/show', function(req, res, next) {
  // console.log(req.session.user);
  // console.log(req.query);
  // query的id为topic的，也就是之前帖子的id。pubulish的id为user的，也就是之前发表人的
  // 首先先要登录才能发表评论，然后进入到评论的回复页面
  if(req.session.user) {   // 查看是否登录了
    Topic.findById(req.query.id, function(err, topic) {
      if(err) {
        next(err)
      }
      topic.readNum += 1;
      console.log(topic);
      console.log(req.query.id);
      Topic.updateOne({_id: req.query.id}, {readNum: topic.readNum}, function(err, message) {
        if(err) {
          next(err)
        }
      })
      User.findById(req.query.p_id, function(err, user) { // req.query.p_id也是User的id
        console.log('user', user);
        if(err) {
          next(err) 
        }
        Comment.find({
          topic_id: req.query.id
        }, function(err, comments) {
          if(err) {
            next(err)
          }
          res.render('./topic/show.html', {
            topic: topic,
            quser: user,
            comments: comments,
            user: req.session.user
          })
        })
      })
    })
  }else {
    res.redirect('/login')
  }
})
router.post('/comment', function(req, res, next) {
  var commentData = new Comment(req.body)
  console.log('commentData为', commentData);
  commentData.save(function(err) {
    if(err) {
      next(err.message)
    }
    res.status(200).json({
      err_code: 0,
      message: 'commentData is sava ok'
    })
  })
})
router.get('/getFuns', function(req, res, next) {
  console.log('添粉成功');
  // console.log(req.query);
  // console.log(req.session.user._id);
  Funs.findOne({fan_id: req.session.user._id}, function(err, funs) {
    if(err) {
      next(err)
    }
    // console.log(funs);
    console.log(req.query);
    Funs.findOne({
      fan_id: req.session.user._id
    }, function(err, fan) {
      if(err) {
        next(err)
      }
      console.log('查询fan成功');
      console.log(fan);
      if(!fan) {
        User.findById(req.query.user_id, function(err, user) {
          if(err) {
            next(err)
          }
          console.log('user', user);
          console.log(user.fans);
          user.fans += 1;
          console.log(user.fans);
          User.updateOne({
            _id: req.query.user_id
          }, {
            fans: user.fans
          }, function(err, message) {
            if(err) {
              next(err)
            }
            console.log('更新粉丝成功');
            console.log(user.fans);
          })
          var nfan = new Funs(req.query)
          nfan.save(req.query, function(err, message) {
            if(err) {
              next(err)
            }
          })
          res.status(200).json({
            err_code: 0,
            message: 'fan is success'
          })
        })
      }else {
        res.status(200).json({
          err_code: 1,
          message: 'fan have exist'
        })
      }
    })
  })
})

module.exports = router