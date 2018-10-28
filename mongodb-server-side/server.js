//BASE SETUP
//=============================================
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
const crypto = require('crypto');

mongoose.connect('mongodb://localhost:27017');
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb'}));

var Administrator = require('./routes/administrator.js');
var Appointment = require('./routes/appointment.js');
var AssessmentTest = require('./routes/assessmentTest.js');
var City = require('./routes/city.js');
var CompletedInjuryForm = require('./routes/completedInjuryForm.js');
var Country = require('./routes/country.js');
var Exercise = require('./routes/exercise.js');
var ExercisesList = require('./routes/exercisesList.js');
var Form = require('./routes/form.js');
var Gender = require('./routes/gender.js');
var Image = require('./routes/image.js');
var InjuryForm = require('./routes/injuryForm.js');
var InjuryResult = require('./routes/injuryResult.js');
var Login = require('./routes/login.js');
var Mail = require('./routes/mail.js');
var PatientProfile = require('./routes/patientProfile.js');
var Payment = require('./routes/payment.js');
var Physiotherapist = require('./routes/physiotherapist.js');
var Province = require('./routes/province.js');
var Question = require('./routes/question.js');
var QuestionsList = require('./routes/questionsList.js');
var QuestionType = require('./routes/questionType.js');
var Recommendation = require('./routes/recommendation.js');
var RehabilitationPlan = require('./routes/rehabilitationPlan.js');
var TestResult = require('./routes/testResult.js');
var Todo = require('./routes/todo.js');
var Treatment = require('./routes/treatment.js');
var UserAccount = require('./routes/userAccount.js');

var port = 8082;
var router = express.Router();

app.use(function(request, response, next){
    response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

// REGISTER ROUTES
// =============================================
app.use('/api', router);
app.use('/administrators', Administrator);
app.use('/appointments', Appointment);
app.use('/assessmentTests', AssessmentTest);
app.use('/cities', City);
app.use('/completedInjuryForms', CompletedInjuryForm);
app.use('/countries', Country);
app.use('/exercises', Exercise);
app.use('/exercisesLists', ExercisesList);
app.use('/forms', Form);
app.use('/genders', Gender);
app.use('/images', Image);
app.use('/injuryForms', InjuryForm);
app.use('/injuryResults', InjuryResult);
app.use('/logins', Login);
app.use('/mail', Mail);
app.use('/patientProfiles', PatientProfile);
app.use('/payments', Payment);
app.use('/physiotherapists', Physiotherapist);
app.use('/provinces', Province);
app.use('/questions', Question);
app.use('/questionsLists', QuestionsList);
app.use('/questionTypes', QuestionType);
app.use('/recommendations', Recommendation);
app.use('/rehabilitationPlans', RehabilitationPlan);
app.use('/testResults', TestResult);
app.use('toDoLists', Todo);
app.use('/treatments', Treatment);
app.use('/userAccounts', UserAccount);

// START SERVER
// =============================================
app.listen(port);
console.log('Magic happens on port ' + port);