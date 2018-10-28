var express = require('express');
var router = express.Router();
var AssessmentTest = require('../models/assessmentTest');
var TestResult = require('../models/testResult');
var Treatment = require('../models/treatment');

//ROUTES FOR TEST RESULT

router.route('/') 
    .post(function(req, res){
        var testResult = new TestResult();
        testResult.question = req.body.testResult.question;
        testResult.answer = req.body.testResult.answer;
        testResult.assessmentTest = req.body.testResult.assessmentTest;
        testResult.treatment = req.body.testResult.treatment;
        AssessmentTest.findById(testResult.assessmentTest)
        .then(function(assessmentTest){
            assessmentTest.testResults.push(testResult._id);
            return assessmentTest.save();
        }).then(function(){
            return Treatment.findById(testResult.treatment);
        }).then(function(treatment){
            treatment.testResults.push(testResult._id);
            return treatment.save();
        }).then(function(){
            return testResult.save();
        }).then(function(){
            console.log('hi');
            res.json({testResult: testResult});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        TestResult.find()
        .then(function(testResults){
            res.json({testResult: testResults});
        }).catch(function(err){
            res.send(err);
        });
    });
router.route('/:testResult_id')
    .get(function (req, res) {
        TestResult.findById(req.params.testResult_id)
        .then(function(testResult){
            res.json({testResult: testResult});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var testResult;
        TestResult.findById(req.params.testResult_id)
        .then(function(theTestResult){
            testResult = theTestResult;
            testResult.question = req.body.testResult.question;
            testResult.answer = req.body.testResult.answer;
            return testResult.save();
        }).then(function(){
            res.json({testResult: testResult});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;