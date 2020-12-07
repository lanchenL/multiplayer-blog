var express = require('express')

var Topic = require('../db/topic')
var User = require('../db/user') 

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

module.exports = router