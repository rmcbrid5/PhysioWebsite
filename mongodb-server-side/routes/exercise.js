var express = require('express');
var router = express.Router();
var Exercise = require('../models/exercise');
var ExercisesList = require('../models/exercisesList');
var Image = require('../models/image');
var RehabilitationPlan = require('../models/rehabilitationPlan');
var Physiotherapist = require('../models/physiotherapist');

// ROUTES FOR EXERCISES
// =============================================================================

router.route('/') 
    .post(function(req, res){
        var exercise = new Exercise();
        exercise.name = req.body.exercise.name;
        exercise.description = req.body.exercise.description;
        exercise.objectives = req.body.exercise.objectives;
        exercise.actionSteps = req.body.exercise.actionSteps;
        exercise.location = req.body.exercise.location;
        exercise.frequency = req.body.exercise.frequency;
        exercise.duration = req.body.exercise.duration;
        exercise.targetDate = new Date(req.body.exercise.targetDate);
        exercise.exercisesLists = [];
        exercise.image = null;

        exercise.save()
        .then(function(){
            res.json({exercise: exercise});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function(req, res){
        Exercise.find()
        .then(function(exercises){
            res.json({exercise: exercises});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:exercise_id')
    .get(function(req, res){
        Exercise.findById(req.params.exercise_id)
        .then(function(exercise){
            res.json({exercise: exercise});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var exercise;
        Exercise.findById(req.params.exercise_id)
        .then(function(theExercise){
            exercise = theExercise;
            exercise.name = req.body.exercise.name;
            exercise.description = req.body.exercise.description;
            exercise.objectives = req.body.exercise.objectives;
            exercise.actionSteps = req.body.exercise.actionSteps;
            exercise.location = req.body.exercise.location;
            exercise.frequency = req.body.exercise.frequency;
            exercise.duration = req.body.exercise.duration;
            exercise.targetDate = new Date(req.body.exercise.targetDate);
            exercise.multimediaURL = req.body.exercise.multimediaURL;
            return exercise.save();
        }).then(function(){
            res.json({exercise: exercise});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        var exercise;
        Exercise.findById(req.params.exercise_id)
        .then(function(theExercise){
            exercise = theExercise;
            return exercise.remove();
        }).then(function(){
            return Image.findById(exercise.image);
        }).then(function(image){
            return image.remove();
        }).then(function(){
            var exercisesList;

            function removeExercisesLists(index){
                if(index !== exercise.exercisesLists.length){
                    return ExercisesList.findById(exercise.exercisesLists[index])
                    .then(function(theExercisesList){
                        exercisesList = theExercisesList;
                        return exercisesList.remove();
                    }).then(function(){
                        return RehabilitationPlan.findById(exercisesList.rehabilitationPlan);
                    }).then(function(rehabilitationPlan){
                        var index = rehabilitationPlan.exercisesLists.indexOf(exercisesList._id);
                        rehabilitationPlan.exercisesLists.splice(index, 1);
                        return rehabilitationPlan.save();
                    }).then(function(){
                        return removeExercisesLists(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return removeExercisesLists(0);
        }).then(function(){
            res.json({exercise: exercise});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;