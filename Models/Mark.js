var mongoose = require('mongoose');

var markSchema = mongoose.Schema({
    groupId: {type:String, required:true},
    studentId: {type:String, required:true},
    subjectId: {type:String, required:true},
    mark: {type:String, required:true}
})

var Mark = module.exports = mongoose.model('Mark', markSchema, "marks");
