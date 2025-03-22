const mongoose = require('mongoose');


const ClassroomFacultySchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Classroom', // Auto-generate ObjectId
    },
    division:{
        type:String,
        enum:["A","B"],
        required:true
    },
    facultyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty',
        required:true
    },
    max_students:{
        type:Number,
        default:22
    },
    remaining_student : {
        type:Number,
        default:22,
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

// Create a unique compound index
ClassroomFacultySchema.index({ division:1, classroomId: 1, facultyId:1 }, { unique: true });

module.exports = mongoose.model('ClassroomFaculty',ClassroomFacultySchema);