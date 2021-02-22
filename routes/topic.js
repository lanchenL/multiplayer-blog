var express = require('express')

var Topic = require('../db/topic')
var Comment = require('../db/comment')
var User = require('../db/user') 
var Funs = require('../db/fun')
var Support = require('../db/support')

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
        return next(err)
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

// 添加点赞功能
router.get('/getSupport', function(req, res, next) {
  console.log('进入点赞页面');
  console.log(req.query);
  let flag1;
  let flag0;
  let body = req.query;
  let sessionUSerId = req.session.user._id;
  console.log('sessionUSerId',sessionUSerId);
  Support.find({
    $and: [
      {
        comment_id: body.comment_id
      },
      {
        support_id: req.session.user._id
      }
    ]
  }, function(err, supportData) {
    if(err) {
      return next(err)
    }
    console.log('supportData为:' ,supportData, supportData.length);
    if(supportData.length == 0) {
      console.log('用户没有点赞过，而且也没保存点赞信息');
      Comment.findById(body.comment_id, function(err, comments) {
        if(err) {
          return next(err); 
        }
        console.log('查询到这条评论信息');
        if(body.stage == 1) {
          comments.like += 1; // 在没有点赞的情况下点赞
          flag1 = true;
        }else {
          comments.like -= 1; // 在没有点赞的情况下不点赞 
          flag0 = true
        }
        console.log(flag1, flag0);
        console.log(comments.like);
        Comment.updateOne({
            _id: body.comment_id
          }, {
            like: comments.like
          }, function(err) {
            if(err) {
              return next(err);
            }
            console.log('更新点赞成功');
            var nSupport = new Support({comment_id: body.comment_id, support_id: sessionUSerId})
            nSupport.save({comment_id: body.comment_id, support_id: sessionUSerId}, function(err, message) {
              if(err) {
                return next(err);
              }
              console.log('保存点赞信息成功');
              res.status(200).json({
                err_code: 0,
                message: 'sava support message is success'
              })
            })
          }
        )
        
      })
     
    }else {
      console.log('用户点赞过！');
      console.log(flag1,flag0);
      Comment.findById(body.comment_id, function(err, comments) {
        if(err) {
          return next(err);
        }
        
        Comment.findById(body.comment_id, function(err, comments) {
          if(err) {
            return next(err);
          }
          console.log('查询到这条评论信息');
         
          if(body.stage == 1) {
            
            if(flag1 == true) {
              comments.like = comments.like;
            }else {
              comments.like += 1; // 在已经点赞的情况下再进行点赞
              flag1 = true;
            }
          }else {
            if(flag0 == true) {
              comments.like = comments.like;
            }else {
              comments.like -= 1; // 在已经点赞的情况下不点赞
              flag0 = true;
            }
          }
          console.log(flag1, flag0);
          console.log(comments.like);
          
          Comment.updateOne({
              _id: body.comment_id
            }, {
              like: comments.like
            }, function(err) {
              if(err) {
                return next(err);
              }
              console.log('更新点赞成功');
              Support.updateOne({comment_id: body.comment_id},{
                like: comments.like
              }, function(err) {
                if(err) {
                  return next(err);
                }
                console.log('更新点赞信息保存成功');
                res.status(200).json({
                  err_code: 0,
                  message: 'sava support message is success'
                })
              })
            }
          )
        })
      })
    }
  })
  // Support.findOne({
  //   $and: [
  //     {
  //       comment_id: body.comment_id
  //     },
  //     {
  //       support_id: req.session.user._id
  //     }
  //   ]
  // }, function(err, supportData) {
  //   if(err) {
  //     return next(err)
  //   }
  //   console.log(supportData);
  //   if(!supportData) {
  //     console.log('用户没有点赞过！');
  //     Comment.findById(body.comment_id, function(err, comments) {
  //       if(err) {
  //         return next(err)
  //       }
  //       console.log('查询到了这条评论', comments);
  //       if(body.stage == 1) {
  //           comments.like += 1;
  //           flag = true;
  //         }else {
  //           comments.like -= 1;
  //           flag = true;
  //         }
  //         Comment.updateOne({
  //           _id: body.comment_id
  //         }, {
  //           like: comments.like
  //         }, function(err) {
  //           if(err) {
  //             return next(err);
  //           }
  //           console.log('更新点赞成功！！', comments.like);
  //           var nSupport = new Support({comment_id: body.comment_id, support_id: sessionUSerId})
  //           nSupport.save({comment_id: body.comment_id, support_id: sessionUSerId}, function(err, message) {
  //             if(err) {
  //               return next(err);
  //             }
  //             console.log('保存点赞信息成功');
  //             res.status(200).json({
  //             err_code: 0,
  //             message: 'sava support is success'
  //           })
              
  //           })
  //         })
  //     })
  //   }else {
  //     console.log('用户点赞过！');
  //     Comment.findById(body.comment_id, function(err, comments) {
  //       if(err) {
  //         return next(err)
  //       }
  //       console.log('查询到了这条评论', comments);
        
  //         if(body.stage == 1 && flag == true) {
  //           comments.like = comments.like;
  //         }else if(body.stage == 1 && flag == false) {
  //           comments.like += 1;
  //           flag = true
  //           console.log(flag);
  //         }else if(body.stage == 0 && flag == true) {
  //           comments.like = comments.like;
  //         }else if(body.stage == 0 && flag == false){
  //           comments.like += 1;
  //           flag = true
  //           console.log(flag);
  //         }

  //         console.log(flag);
  //         Comment.updateOne({
  //           _id: body.comment_id
  //         }, {
  //           like: comments.like
  //         }, function(err) {
  //           if(err) {
  //             return next(err);
  //           }
  //           console.log('更新点赞成功！！', comments.like);
            
  //           Support.updateOne({comment_id: body.comment_id},{
  //             like: comments.like
  //           }, function(err, message) {
  //             if(err) {
  //               return next(err);
  //             }
  //             console.log('更新点赞信息保存成功');
  //             res.status(200).json({
  //               err_code: 1,
  //               message: 'sava nonsupport is success'
  //             })
  //           })
  //         })
  //     })
  //   }
  // })


  // Support.findOne({
  //   comment_id: body.comment_id
  // }, function(err, supportData) {
  //   if(err) {
  //     return next(err);
  //   }
  //   if(!supportData) {
  //     Comment.findById(body.comment_id, function(err, comments) {
  //       if(err) {
  //         return next(err)
  //       }
  //       console.log(comments);
  //       if(comments) {
  //         console.log('有此条回复');
  //         if(body.status == 1) {
  //           comments.like += 1;
  //         }else {
  //           comments.like -= 1;
  //         }
  //         Comment.updateOne({
  //           _id: body.comment_id
  //         }, {
  //           like: comments.like
  //         }, function(err) {
  //           if(err) {
  //             return next(err);
  //           }
  //           console.log('更新点赞成功！！', comments.like);
  //           var nSupport = new Support({comment_id: body.comment_id, support_id: body.user_id})
  //           nSupport.save({comment_id: body.comment_id, support_id: body.user_id}, function(err, message) {
  //             if(err) {
  //               return next(err);
  //             }
  //             console.log('保存点赞信息成功');
  //           })
  //           // res.status(200).json({
  //           //   err_code: 0,
  //           //   message: 'fan is success'
  //           // })
  //         })
  //       }else {
  //         console.log('没有回复过');
  //       }
  //     })
  //   }else {
  //     console.log('已经点赞过了！');
  //     // res.redirect('/topics/show')
  //     res.redirect('/')
  //   }
  // })
})


// 添加粉丝
router.get('/getFuns', function(req, res, next) {
  console.log('添粉成功');
  console.log(req.query);
  console.log(req.session.user._id);
  Funs.findOne({
    $and: [
      {
        user_id: req.query.user_id
      },
      {
        fan_id: req.session.user._id
      }
    ]
  }, function(err, fan) {
    if(err) {
      next(err)
    }
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



// 下面写法有问题，点击关注的时候只能关注一个，再点击关注另一个作者的时候，显示已经关注过了
  // Funs.findOne({user_id: req.query.user_id}, function(err, funs) {
  //   if(err) {
  //     next(err)
  //   }
  //   console.log('查询评论作者id成功');
  //   // console.log(funs);
  //   console.log(req.query);
  //   Funs.findOne({
  //     fan_id: req.session.user._id
  //   }, function(err, fan) {
  //     if(err) {
  //       next(err)
  //     }
  //     console.log('查询当前登陆者funs的id信息成功');
  //     console.log(fan);
  //     if(!fan) {
  //       User.findById(req.query.user_id, function(err, user) {
  //         if(err) {
  //           next(err)
  //         }
  //         console.log('user', user);
  //         console.log(user.fans);
  //         user.fans += 1;
  //         console.log(user.fans);
  //         User.updateOne({
  //           _id: req.query.user_id
  //         }, {
  //           fans: user.fans
  //         }, function(err, message) {
  //           if(err) {
  //             next(err)
  //           }
  //           console.log('更新粉丝成功');
  //           console.log(user.fans);
  //         })
  //         var nfan = new Funs(req.query)
  //         nfan.save(req.query, function(err, message) {
  //           if(err) {
  //             next(err)
  //           }
  //         })
  //         res.status(200).json({
  //           err_code: 0,
  //           message: 'fan is success'
  //         })
  //       })
  //     }else {
  //       res.status(200).json({
  //         err_code: 1,
  //         message: 'fan have exist'
  //       })
  //     }
  //   })
  // })
})

module.exports = router