const mongoose = require('mongoose');


const ClassroomSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    description:{
        type:String,
    },

    semester: {
        type: Number,
        required:true
    },
    criteriaId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Criteria',
        required:true
    },
    background:{
        type:String,
        default: 'https://gstatic.com/classroom/themes/SocialStudies.jpg'
    },
    avatar:{
        type:String,
        default: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
    },
    projects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        }],
    mode:{
        type:String,
        default: 'phase1'
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


module.exports = mongoose.model('Classroom',ClassroomSchema);