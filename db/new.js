var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});

var Schema = mongoose.Schema

var newSchema = new Schema({
  theme: {
    type: String,
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  creat_data: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('News', newSchema)