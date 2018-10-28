var express = require('express');
var router = express.Router();
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var RehabilitationPlan = require('../models/rehabilitationPlan');
var TestResult = require('../models/testResult');
var Treatment = require('../models/treatment');

// ROUTES FOR TREATMENTS
// =============================================================================

router.route('/') 
    .post(function(req, res){
        var treatment = new Treatment();
        treatment.dateAssigned = new Date(req.body.treatment.dateAssigned);
        treatment.physiotherapist = req.body.treatment.physiotherapist;
        treatment.rehabilitationPlan = req.body.treatment.rehabilitationPlan;
        treatment.patientProfile = req.body.treatment.patientProfile;
        treatment.recommendations = [];
        treatment.testResults = [];

        Physiotherapist.findById(treatment.physiotherapist)
        .then(function(physiotherapist){
            physiotherapist.treatments.push(treatment._id);
            return physiotherapist.save();
        }).then(function(){
            return RehabilitationPlan.findById(treatment.rehabilitationPlan);
        }).then(function(rehabilitationPlan){
            rehabilitationPlan.treatments.push(treatment._id);
            return rehabilitationPlan.save();
        }).then(function(){
            return PatientProfile.findById(treatment.patientProfile);
        }).then(function(patientProfile){
            patientProfile.treatments.push(treatment._id);
            return patientProfile.save();
        }).then(function(){
            return treatment.save();
        }).then(function(){
            res.json({treatment: treatment});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        Treatment.find()
        .then(function(treatments){
            res.json({treatment: treatments});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:treatment_id')
    .get(function(req, res){
        Treatment.findById(req.params.treatment_id)
        .then(function(treatment){
            res.json({treatment: treatment});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var treatment;
        Treatment.findById(req.params.treatment_id)
        .then(function(theTreatment){
            treatment = theTreatment;
            return treatment.remove();
        }).then(function(){
            return Physiotherapist.findById(treatment.physiotherapist);
        }).then(function(physiotherapist){
            var index = physiotherapist.treatments.indexOf(treatment._id);
            physiotherapist.treatments.splice(index, 1);
            return physiotherapist.save();
        }).then(function(){
            return PatientProfile.findById(treatment.patientProfile);
        }).then(function(patientProfile){
            var index = patientProfile.treatments.indexOf(treatment._id);
            patientProfile.treatments.splice(index, 1);
            return patientProfile.save();
        }).then(function(){
            return RehabilitationPlan.findById(treatment.rehabilitationPlan);
        }).then(function(rehabilitationPlan){
            var index = rehabilitationPlan.treatments.indexOf(treatment._id);
            rehabilitationPlan.treatments.splice(index, 1);
            return rehabilitationPlan.save();
        }).then(function(){
            var recommendation;

            function removeRecommendations(index){
                if(index !== treatment.recommendations.length){
                    return Recommendation.findById(treatment.recommendations[index])
                    .then(function(theRecommendation){
                        recommendation = theRecommendation;
                        return recommendation.remove();
                    }).then(function(){
                        return AssessmentTest.findById(recommendation.assessmentTest);
                    }).then(function(assessmentTest){
                        var index = assessmentTest.recommendations.indexOf(recommendation._id);
                        assessmentTest.recommendations.splice(index, 1);
                        return assessmentTest.save();
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
                if(index !== treatment.testResults.length){
                    return TestResult.findById(treatment.testResults[index])
                    .then(function(theTestResult){
                        testResult = theTestResult;
                        return testResult.remove();
                    }).then(function(){
                        return AssessmentTest.findById(testResult.assessmentTest);
                    }).then(function(assessmentTest){
                        var index = assessmentTest.testResults.indexOf(testResult._id);
                        assessmentTest.testResults.splice(index, 1);
                        return assessmentTest.save();
                    }).then(function(){
                        return removeRecommendations(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return removeTestResults(0);
        }).then(function(){
            res.json({treatment: treatment});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;