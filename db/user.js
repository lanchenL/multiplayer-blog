var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});

var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_time: {
    type: Date,
    default: Date.now
  },
  // 头像
  avatar: {
    type: String,
    default: '/public/img/luo.jpg'
  },
  // 简介
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: '保密'
  },
  birthday: {
    type: String
  },
  status: {
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  fans: {
    type: Number,
    default: 0 
  }
})
module.exports = mongoose.model('User', userSchema)