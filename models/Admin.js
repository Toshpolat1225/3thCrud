const {Schema, model}= require("mongoose")

const AdminSchema = Schema({
    login:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    telegram:{
        type: String,
    },
    instagram:{
        type: String,
    },
    password:{
        type: String,
        required: true,
        minlength: 4
    },
    avatar:{
        type: String,
    },
})

module.exports= model("admin", AdminSchema)