const {
    Schema,
    model
} = require('mongoose')

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    groupId: {
        ref: 'groups',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = model('student', studentSchema)