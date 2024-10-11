const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    time:{
        type:Number,
        required:true,
    }
},{timestamps:true});


module.exports = mongoose.model('Subjects',subjectSchema);
