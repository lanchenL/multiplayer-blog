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
    },
    support_1: {
        type: Number
    },
    support_0: {
        type: Number
    }
})


module.exports = mongoose.model('Support', supportSchema)