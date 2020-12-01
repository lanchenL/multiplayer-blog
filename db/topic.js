var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,  // 使用新的服务器发现和监视引擎
  useFindAndModify: false //Mongoose:不推荐使用未将“useFindAndModify”选项设置为false的“FindAndDupDate（）”和“FindAndDelete（）”
})

var Schema = mongoose.Schema

var topicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  palte: {
    type: String
  },
  publisher_id: {
    type: String
  },
  publisher: {
    type: String
  },
  createtime: {
    type: String
  },
  readNum: {
    type: Number,
    default: 0
  },
  like: {
    type: Number
  },
  dislike: {
    type: Number
  }
})

module.exports = mongoose.model('Topic', topicSchema)