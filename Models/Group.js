var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    number: {type:String, required:true},
    name: {type:String, required:true},
    curator: {type:Object, required:true},
    students: {type:Array, required:true},
    subjects:{type:Array, require:true}
})

var Group = module.exports = mongoose.model('Group', groupSchema, "groups");
