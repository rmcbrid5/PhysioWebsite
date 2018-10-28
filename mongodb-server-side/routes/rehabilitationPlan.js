var express = require('express');
var router = express.Router();
var AssessmentTest = require('../models/assessmentTest');
var Exercise = require('../models/exercise');
var ExercisesList = require('../models/exercisesList');
var Form = require('../models/form');
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var Recommendation = require('../models/recommendation');
var RehabilitationPlan = require('../models/rehabilitationPlan');
var TestResult = require('../models/testResult');
var Treatment = require('../models/treatment');

// ROUTES FOR REHABILITATION PLANS
// =============================================================================

router.route('/') 
    .post(function(req, res){
        var rehabilitationPlan = new RehabilitationPlan();
        rehabilitationPlan.name = req.body.rehabilitationPlan.name;
        rehabilitationPlan.description = req.body.rehabilitationPlan.description;
        rehabilitationPlan.physiotherapist = req.body.rehabilitationPlan.physiotherapist;
        rehabilitationPlan.goal = req.body.rehabilitationPlan.goal;
        rehabilitationPlan.assessmentTests = [];
        rehabilitationPlan.exercisesLists = [];
        rehabilitationPlan.treatments = [];
        
        Physiotherapist.findById(rehabilitationPlan.physiotherapist)
        .then(function(physiotherapist){
            physiotherapist.rehabilitationPlans.push(rehabilitationPlan._id);
            return physiotherapist.save();
        }).then(function(){
            return rehabilitationPlan.save();
        }).then(function(){
            res.json({rehabilitationPlan: rehabilitationPlan});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        RehabilitationPlan.find()
        .then(function(rehabilitationPlans){
            res.json({rehabilitationPlan: rehabilitationPlans});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:rehabilitationPlan_id')
    .get(function(req, res){
        RehabilitationPlan.findById(req.params.rehabilitationPlan_id)
        .then(function(rehabilitationPlan){
            res.json({rehabilitationPlan: rehabilitationPlan});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var rehabilitationPlan;
        RehabilitationPlan.findById(req.params.rehabilitationPlan_id)
        .then(function(theRehabilitationPlan){
            rehabilitationPlan = theRehabilitationPlan;
            rehabilitationPlan.name = req.body.rehabilitationPlan.name;
            rehabilitationPlan.description = req.body.rehabilitationPlan.description;
            rehabilitationPlan.goal = req.body.rehabilitationPlan.goal;
            return rehabilitationPlan.save();
        }).then(function(){
            res.json({rehabilitationPlan: rehabilitationPlan});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var rehabilitationPlan;
        RehabilitationPlan.findById(req.params.rehabilitationPlan_id)
        .then(function(theRehabilitationPlan){
            rehabilitationPlan = theRehabilitationPlan;
            return rehabilitationPlan.remove();
        }).then(function(){
            return Physiotherapist.findById(rehabilitationPlan.physiotherapist);
        }).then(function(physiotherapist){
            var index = physiotherapist.rehabilitationPlans.indexOf(rehabilitationPlan._id);
            physiotherapist.rehabilitationPlans.splice(index, 1);
            return physiotherapist.save();
        }).then(function(){
            var exercisesList;

            function removeExercisesLists(index){
                if(index !== rehabilitationPlan.exercisesLists.length){
                    return ExercisesList.findById(rehabilitationPlan.exercisesLists[index])
                    .then(function(theExercisesList){
                        exercisesList = theExercisesList;
                        return exercisesList.remove();
                    }).then(function(){
                        return Exercise.findById(exercisesList.exercise);
                    }).then(function(exercise){
                        var index = exercise.exercisesLists.indexOf(exercisesList._id);
                        exercise.exercisesLists.splice(index, 1);
                        return exercise.save();
                    }).then(function(){
                        return removeExercisesLists(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return removeExercisesLists(0);
        }).then(function(){
            var assessmentTest;
            var recommendation;
            var testResult;

            function removeAssessmentTests(index){
                if(index !== rehabilitationPlan.assessmentTests.length){
                    return AssessmentTest.findById(rehabilitationPlan.assessmentTests[index])
                    .then(function(theAssessmentTest){
                        assessmentTest = theAssessmentTest;
                        return assessmentTest.remove();
                    }).then(function(){
                        return removeRecommendations(0);
                    }).then(function(){
                        return removeTestResults(0);
                    }).then(function(){
                        return Form.findById(assessmentTest.form);
                    }).then(function(form){
                        var index = form.assessmentTests.indexOf(assessmentTest._id);
                        form.assessmentTests.splice(index, 1);
                        return form.save();
                    }).then(function(){
                        return removeAssessmentTests(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

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

            return removeAssessmentTests(0);
        }).then(function(){
            var treatment;
            var recommendation;
            var recommendationExists;

            function removeTreatments(index){
                if(index !== rehabilitationPlan.treatments.length){
                    return Treatment.findById(rehabilitationPlan.treatments[index])
                    .then(function(theTreatment){
                        treatment = theTreatment;
                        return treatment.remove();
                    }).then(function(){
                        return removeRecommendations(0);
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
                        return removeTreatments(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            function removeRecommendations(index){
                if(index !== treatment.recommendations.length){
                    return Recommendation.findById(treatment.recommendations[index])
                    .then(function(theRecommendation){
                        recommendation = theRecommendation;
                        if(recommendation){
                            recommendationExists = true;
                            return recommendation.remove();
                        }
                        else{
                            recommendationExists = false;
                        }
                    }).then(function(){
                        if(recommendationExists){
                            return AssessmentTest.findById(recommendation.assessmentTest);
                        }
                    }).then(function(assessmentTest){
                        if(recommendationExists){
                            var index = assessmentTest.recommendations.indexOf(recommendation._id);
                            assessmentTest.recommendations.splice(index, 1);
                            return assessmentTest.save();
                        }
                    }).then(function(){
                        return removeRecommendations(index + 1);
                    });
                }
            }

            return removeTreatments(0);
        }).then(function(){
            res.json({rehabilitationPlan: rehabilitationPlan});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;