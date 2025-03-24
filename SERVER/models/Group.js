const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    facultyprojectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultyProject',
        required: false
    },
    groupchoice: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultyProject',
        required: false
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    avg_mark: {
        type: Number,
        default: 0.0
    },
    groupCode: {
        type: String,
        required: true,
        unique: true,
        maxlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    mode: {
        type: String,
        enum: ["phase1", "phase2","phase3"],
        default: "phase1"
    }
});


module.exports = mongoose.model('Group', GroupSchema);
