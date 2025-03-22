const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true
    },
    defination: {
        type: String,
        required: true
    },
    max_groups:{
        type:Number,
        default:8
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



module.exports = mongoose.model('Project',ProjectSchema);