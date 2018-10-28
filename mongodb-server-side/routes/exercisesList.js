var express = require('express');
var router = express.Router();
var Exercise = require('../models/exercise');
var ExercisesList = require('../models/exercisesList');
var RehabilitationPlan = require('../models/rehabilitationPlan');

router.route('/')
    .post(function (req, res) {
        var exercisesList = new ExercisesList();
        exercisesList.rehabilitationPlan = req.body.exercisesList.rehabilitationPlan;
        exercisesList.exercise = req.body.exercisesList.exercise;
        RehabilitationPlan.findById(exercisesList.rehabilitationPlan)
        .then(function(rehabilitationPlan){
            rehabilitationPlan.exercisesLists.push(exercisesList._id);
            return rehabilitationPlan.save();
        }).then(function(){
            return Exercise.findById(exercisesList.exercise);
        }).then(function(exercise){
            exercise.exercisesLists.push(exercisesList._id);
            return exercise.save();
        }).then(function(){
            return exercisesList.save();
        }).then(function(){
            res.json({exercisesList: exercisesList});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        ExercisesList.find()
        .then(function(exercisesLists){
            res.json({exercisesList: exercisesLists});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:exercisesList_id')
    .get(function (req, res) {
        ExercisesList.findById(req.params.exercisesList_id)
        .then(function(exercisesList){
            res.json({exercisesList: exercisesList});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var exercisesList;
        ExercisesList.findById(req.params.exercisesList_id)
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
            return Exercise.findById(exercisesList.exercise);
        }).then(function(exercise){
            var index = exercise.exercisesLists.indexOf(exercisesList._id);
            exercise.exercisesLists.splice(index, 1);
            return exercise.save();
        }).then(function(){
            res.json({exercisesList: exercisesList});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;