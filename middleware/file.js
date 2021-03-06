const multer = require('multer')
const moment = require('moment')
function randomFunc(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
const random = randomFunc(1,9)

// storage filename // allowedTypes

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const date = moment().format('DDMMYYYY-HHmmss-sss')
        cb(null, `${date}--randomNumber${random}--${file.originalname}`)
    }
})

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})