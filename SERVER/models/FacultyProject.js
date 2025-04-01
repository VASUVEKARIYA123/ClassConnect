const mongoose = require('mongoose');


const FacultyProjectSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty', // Auto-generate ObjectId
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // Auto-generate ObjectId
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom', // Auto-generate ObjectId
    },
    allocated : {
        type : Boolean,
        default : false
    }
});

// Create a unique compound index on fid, pid, and cid
FacultyProjectSchema.index({ facultyId: 1, projectId: 1, classroomId: 1 }, { unique: true });

module.exports = mongoose.model('FacultyProject',FacultyProjectSchema);