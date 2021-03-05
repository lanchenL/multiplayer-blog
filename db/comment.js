var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,  // 使用新的服务器发现和监视引擎
  useFindAndModify: false //Mongoose:不推荐使用未将“useFindAndModify”选项设置为false的“FindAndDupDate（）”和“FindAndDelete（）”
})

var Schema = mongoose.Schema

var commentSchema = new Schema({
  topic_id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createtime: {
    type: String
  },
  from_id: {  // 文章的发表者
    type: String,
    requid: true
  },
  from_nickname: {
    type: String
  },
  like: {
    type: Number,
    default: 0
  },
  comment_support_id: {
    type: String,
    default: ''
  },
  comment_mark_support: {
    type: Number,
    default: 0
  },
  comment_mark_noSupport: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Comment', commentSchema)