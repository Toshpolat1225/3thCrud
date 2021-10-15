const {
    Schema,
    model
} = require('mongoose')

const searchSchema = new Schema({
    bin: {
        type: String,
        required: true
    }
})

module.exports = model('search', searchSchema) 