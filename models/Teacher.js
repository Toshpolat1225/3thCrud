const {
    Schema,
    model
} = require('mongoose')

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    }
})

module.exports = model('teacher', teacherSchema)