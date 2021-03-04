var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/blog', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

var Schema = mongoose.Schema

var answerSchema = new Schema({
    comment_id: {
        type: String
    },
    answer_content: {
      type: String
    },
    comment_pulisher_id: {
      type: String
    },
    comment_answer_id: {
      type: String
    },
    comment_answer_nickname: {
      type: String
    }
})


module.exports = mongoose.model('Answer', answerSchema)