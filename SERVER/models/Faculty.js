const mongoose = require('mongoose');


const FacultySchema = new mongoose.Schema({
    role:{
        type:String,
        enum:["teacher","admin","subadmin"],
        default:"teacher"
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required: true
    },  
    rating: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    domain: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});



module.exports = mongoose.model('Faculty',FacultySchema);