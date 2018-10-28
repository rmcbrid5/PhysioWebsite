var express = require('express');
var router = express.Router();
var AssessmentTest = require('../models/assessmentTest');
var Form = require('../models/form');
var Physiotherapist = require('../models/physiotherapist');
var Recommendation = require('../models/recommendation');
var RehabilitationPlan = require('../models/rehabilitationPlan');
var TestResult = require('../models/testResult');
var Treatment = require('../models/treatment');

//ROUTES FOR ASSESSMENT TESTS
router.route('/')
    .post(function(req, res){
        var assessmentTest = new AssessmentTest();
        assessmentTest.name = req.body.assessmentTest.name;
        assessmentTest.description = req.body.assessmentTest.description;
        assessmentTest.form = req.body.assessmentTest.form;
        assessmentTest.rehabilitationPlan = req.body.assessmentTest.rehabilitationPlan;
        assessmentTest.recommendations = [];
        assessmentTest.testResults = [];

        Form.findById(assessmentTest.form)
        .then(function(form){
            form.assessmentTests.push(assessmentTest.id);
            return form.save();
        }).then(function(){
            return RehabilitationPlan.findById(assessmentTest.rehabilitationPlan);
        }).then(function(rehabilitationPlan){
            rehabilitationPlan.assessmentTests.push(assessmentTest.id);
            return rehabilitationPlan.save();
        }).then(function(){
            return assessmentTest.save();
        }).then(function(){
            res.json({assessmentTest: assessmentTest});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        AssessmentTest.find()
        .then(function(assessmentTests){
            res.json({assessmentTest: assessmentTests});
        }).catch(function(err){
            res.send(err);
        });
    });
router.route('/:assessmentTest_id')
    .get(function (req, res) {
        AssessmentTest.findById(req.params.assessmentTest_id)
        .then(function(assessmentTest){
            res.json({assessmentTest: assessmentTest});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var assessmentTest;
        AssessmentTest.findById(req.params.assessmentTest_id)
        .then(function(theAssessmentTest){
            assessmentTest = theAssessmentTest;
            assessmentTest.name = req.body.assessmentTest.name;
            assessmentTest.description = req.body.assessmentTest.description;
            return assessmentTest.save();
        }).then(function(){
            res.json({assessmentTest: assessmentTest});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var assessmentTest;

        AssessmentTest.findById(req.params.assessmentTest_id)
        .then(function(theAssessmentTest){
            assessmentTest = theAssessmentTest;
            return assessmentTest.remove();
        }).then(function(){
            return Form.findById(assessmentTest.form);
        }).then(function(form){
            var index = form.assessmentTests.indexOf(assessmentTest._id);
            form.assessmentTests.splice(index, 1);
            return form.save();
        }).then(function(){
            return RehabilitationPlan.findById(assessmentTest.rehabilitationPlan);
        }).then(function(rehabilitationPlan){
            var index = rehabilitationPlan.assessmentTests.indexOf(assessmentTest._id);
            rehabilitationPlan.assessmentTests.splice(index, 1);
            return rehabilitationPlan.save();
        }).then(function(){
            var recommendation;

            function removeRecommendations(index){
                if(index !== assessmentTest.recommendations.length){
                    return Recommendation.findById(assessmentTest.recommendations[index])
                    .then(function(theRecommendation){
                        recommendation = theRecommendation;
                        return recommendation.remove();
                    }).then(function(){
                        return Treatment.findById(recommendation.treatment);
                    }).then(function(treatment){
                        var index = treatment.recommendations.indexOf(recommendation._id);
                        treatment.recommendations.splice(index, 1);
                        return treatment.save();
                    }).then(function(){
                        return removeRecommendations(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return removeRecommendations(0);
        }).then(function(){
            var testResult;

            function removeTestResults(index){
                if(index !== assessmentTest.testResults.length){
                    return TestResult.findById(assessmentTest.testResults[index])
                    .then(function(theTestResult){
                        testResult = theTestResult;
                        return testResult.remove();
                    }).then(function(){
                        return Treatment.findById(testResult.treatment);
                    }).then(function(treatment){
                        var index = treatment.testResults.indexOf(testResult._id);
                        treatment.testResults.splice(index, 1);
                        return treatment.save();
                    }).then(function(){
                        return removeTestResults(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return removeTestResults(0);
        }).then(function(){
            res.json({assessmentTest: assessmentTest});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;