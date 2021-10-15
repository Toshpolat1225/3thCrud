const {
    Schema,
    model
} = require('mongoose')

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    teacherId: {
        ref: 'teachers',
        type: Schema.Types.ObjectId,
        required: true
    },
})

module.exports = model('group', groupSchema)