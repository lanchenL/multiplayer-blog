var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/blog', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

var Schema = mongoose.Schema

var supportSchema = new Schema({
    comment_id: {
        type: String
    },
    support_id: {
        type: String
    }
})


module.exports = mongoose.model('Support', supportSchema)