var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
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
    default: '/public/img/avatar-default.png'
  },
  // 简介
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  }
})
module.exports = mongoose.model('User', userSchema)