const mongoose = require('mongoose');


const LabTaskSchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom', // Auto-generate ObjectId
        required:true
    },
    facultiesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty', // Auto-generate ObjectId
    }],
    labNumber:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    total_marks:{
        type:Number,
        default:100
    },
    due_date:{
        type:Date,
        required:true
    },
    posted_date:{
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.model('LabTask',LabTaskSchema);