const mongoose = require('mongoose');


const ClassroomStudentSchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Classroom', // Auto-generate ObjectId
        required:true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student', // Auto-generate ObjectId
        required:true
    },
    division:{
        type:String,
        enum:["A","B"],
        required:true
    },
    cpi:{
        type:Number,
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

// Create a unique compound index on fid, pid, and cid
ClassroomStudentSchema.index({ studentId:1, classroomId: 1 }, { unique: true });

module.exports = mongoose.model('ClassroomStudent',ClassroomStudentSchema);