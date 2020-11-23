// 路由依赖于express
var express = require('express')
// 导入路由
var router = express.Router()
// 设置路由
router.get('/', function (req, res) {
  res.render('index.html')
})

router.get('/login', function(req, res) {
  res.render('login.html')
})
router.post('/login', function (req, res ) {

})

router.get('/register', function(req, res) {
  res.render('register.html')
})
router.post('/register', function (req, res ) {
  console.log(req.body);
})
// 导出路由
module.exports = router;