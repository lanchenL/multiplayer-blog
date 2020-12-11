var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/blog', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

var Schema = mongoose.Schema

var fansSchema = new Schema({
    user_id: {
        type: String
    },
    fan_id: {
        type: String
    }
})


var Fan = module.exports = mongoose.model('Fan', fansSchema)