var mongoose = require('mongoose');

var subjectSchema = mongoose.Schema({
    name: {type:String, required:true},
    teachers: {type:Object, required:true}
})

var Subject = module.exports = mongoose.model('Subject', subjectSchema, "subjects");
