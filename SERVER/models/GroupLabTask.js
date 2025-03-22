const mongoose = require('mongoose');


const GroupLabTaskSchema = new mongoose.Schema({
    labtaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTask', // Auto-generate ObjectId
        required:true
    },
    groupId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group', // Auto-generate ObjectId
    }],
    submission:{
        type:String,
        requried:true
    },
    marks:{
        type:Number,
        default:50
    },
    remarks:{
        type:String,
    },
    submission_date:{
        type:Date,
        default:Date.now
    },
});

GroupLabTaskSchema.index({ groupId: 1, labtaskId: 1 }, { unique: true });

module.exports = mongoose.model('GroupLabTask',GroupLabTaskSchema);