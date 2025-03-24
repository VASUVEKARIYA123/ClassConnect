const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    facultyprojectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultyProject'
    },
    groupchoice: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultyProject',
        // validate: [arrayLimit, '{PATH} exceeds the limit of 5 choices']
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
        enum: ["phase1", "phase2"],
        default: "phase1"
    }
});

// Custom validation function to check array length
// function arrayLimit(val) {
//     return val.length <= 5;
// }

module.exports = mongoose.model('Group', GroupSchema);
