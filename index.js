const jwt = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var User = require('./models/User');
var cors = require('cors');
var Group = require('./models/Group');
var app = express();
var Subject = require('./models/Subject');
var Mark = require('./models/Mark')

var db = mongoose.connect('mongodb+srv://userDB:1111Aa@cluster0-dxymg.azure.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true }, function(err, response){
  if(err) console.log(err);
  console.log("Connection has been added");
});

app.use(cors('*'));

app.use(bodyparser.json({limit: '10mb', extended: true}));
app.use(bodyparser.urlencoded({limit: '10mb', extended: true}));

app.set('port', process.env.PORT || 3000);
app.use(bodyparser.json());


app.post('/register', (req, res) => {
  console.log(req.body);
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  const encryptedString = cryptr.encrypt(req.body.password);
  var password = encryptedString;
  var role = 'teacher';

  var user = new User();
  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  user.password = password;
  user.role = role;
  user.access = false;

  console.log(user)
  user.save((err, result)=>{
    if(err){
      console.log("There us an errir in adding user in db");
      res.sendStatus(500);
    }
    res.sendStatus(200);
  })

})

let secret = 'some_secret';


app.post('/save', (req, res) => {
  var userData = {
    "email": req.body.email,
    "password": req.body.password
  }

  User.findOne({email: req.body.email},function(err, user){
    if(err){
      console.log(err);
    }
    else{
      console.log(user);
      let token = jwt.sign(userData, secret, { expiresIn: '99995s'})
      res.status(200).json({"token": token,"user": user});
    }
  })

});


app.listen(app.get('port'), function(err, response){
  console.log("Server is running on port ", app.get('port'));
});

app.get('/admin/users/unacceppted', function(req, res){
  User.find({ "access": { "$in": ["false",false] } },function(err, users){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"users": users});        }
  })
});


app.get('/admin/users/teachers', function(req, res){
  User.find({role: 'teacher'},function(err, users){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"users": users});
      console.log(users);
    }
  })
});

app.get('/admin/users/students', function(req, res){
  User.find({role: 'student'},function(err, users){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"users": users});
      console.log(users);
    }
  })
});

app.get('/admin/subject/all', function(req, res){
  Subject.find(function(err, subjects){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"subjects": subjects});
      console.log(subjects);
    }
  })
});


app.get('/admin/users/changeAccess/:id/:access', function(req, res){
  User.findOne({_id: req.params.id}, function (err, user) {
    console.log(user);
    user.access = req.params.access;

    user.save(function (err) {
      if(err) {
        console.error('ERROR!');
      }
      res.sendStatus(200);
    });
  });
});

app.get('/admin/users/student/:id', function(req, res){
  User.findOne({_id: req.params.id},function(err, users){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"users": users});
      console.log(users);
    }
  })
});

app.get('/admin/subject/:id', function(req, res){
  Subject.findOne({_id: req.params.id},function(err, subjects){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"subjects": subjects});
      console.log(subjects);
    }
  })
});


app.get('/teacher/:id', function(req, res){
  User.findOne({_id: req.params.id},function(err, user){
    console.log('hjk');
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"user": user});
    }
  })
});


app.post('/admin/group/create', function(req, res){
  var number = req.body.numder;
  var name = req.body.name;
  var curator = req.body.curator;
  var students = req.body.students;
  var subjects = req.body.subjects

  var group = new Group();
  group.number = number;
  group.name = name;
  group.curator = curator;
  group.students = students;
  group.subjects = subjects;

  console.log(group.number);

  group.save(function (err) {
    if(err) {
      console.error('ERROR!');
    }
    res.sendStatus(200);
  });
});



app.post('/admin/teacher/create', function(req, res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var subjects = req.body.subjects;
  var role = req.body.role;
  var access = req.body.access;

  var teacher = new User();
  teacher.firstname = firstname;
  teacher.lastname = lastname;
  teacher.email = email;
  teacher.subjects = subjects;
  teacher.role = role;
  teacher.access = access;
  teacher.password = 'asdf'

  console.log(teacher);
  teacher.save(function (err) {
    if(err) {
      console.error('ERROR!');
      console.error(err);

    }
    res.sendStatus(200);
  });
});



app.post('/admin/student/create', function(req, res){
  console.log(req.body);
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var role = 'student';
  var access = true;
  var group = req.body.group_;

  var student = new User();
  student.firstname = firstname;
  student.lastname = lastname;
  student.email = email;
  student.role = role;
  student.access = access;
  student.password = '1111'
  student.save(function (err) {
    if(err) {
      console.error('ERROR!');
      console.error(err);

    }
    Group.findOne({_id: group},(function(err, groups){
      if(err){
        console.log(err);
      }
      else{
        console.log(groups);
        const groups_ = groups;
        groups_.students.push(student);
        groups_.save(function(err) {
          if(err) {
            console.error('ERROR!');
            console.error(err);

          }
          res.sendStatus(200);
        })}}));
  });
});


app.post('/admin/subject/create', function(req, res){
  var name = req.body.name;
  var teachers = req.body.teachers;

  var subject = new Subject();
  subject.name = name;
  subject.teachers = teachers;


  subject.save(function (err) {
    if(err) {
      console.error('ERROR!');
    }
    res.sendStatus(200);
  });
});


app.get('/admin/group/all', function(req, res){
  Group.find(function(err, groups){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"groups": groups});
      console.log(groups);
    }
  })
});



app.get('/group/:id', function(req, res){
  Group.findOne({_id: req.params.id},function(err, group){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"group": group});
      console.log(group);
    }
  })
});


app.post('/make-mark', function(req, res){

  var idStudent = req.body.idStudent;
  var idGroup = req.body.idGroup;
  var idSubject = req.body.idSubject;

  var mark = new Mark();
  mark.groupId = idGroup;
  mark.studentId = idStudent;
  mark.subjectId = idSubject;
  mark.mark = req.body.mark;

  mark.save(function(err, mark){
    if(err){
      console.log(err);
    }
    else{

      res.sendStatus(200);
    }
  })

});
