const mongoose = require('mongoose');


const CriteriaSchema = new mongoose.Schema({
    cpi:{
        type: Number,
        default:0.5,
    },
    min_group_size: {
        type: Number,
        default:2,
    },
    max_group_size: {
        type: Number,
        default:3,
    },
    division:{
        type:Boolean,
        required:true
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


module.exports = mongoose.model('Criteria',CriteriaSchema);