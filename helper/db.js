const mongoose = require('mongoose')
const URI = 'mongodb+srv://texnar1225:texnar1225@cluster0.ov7ap.mongodb.net/CRM2'

module.exports = () => {
    try {
        mongoose.connect(URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('MongoDB connected with global');
        });

    } catch (err) {
        throw err;
    }
}