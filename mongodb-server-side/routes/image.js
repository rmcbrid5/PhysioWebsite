var express = require('express');
var router = express.Router();
var Exercise = require('../models/exercise');
var Image = require('../models/image');
var PatientProfile = require('../models/patientProfile');


router.route('/')
    .post(function (req, res) {
        var image = new Image();
        image.name = req.body.image.name;
        image.type = req.body.image.type;
        image.size = req.body.image.size;
        image.rawSize = req.body.image.rawSize;
        image.imageData = req.body.image.imageData;
        image.patientProfile = req.body.image.patientProfile;
        image.exercise = req.body.image.exercise;

        var existingImage = false;
        var exercise;
        if(image.exercise){
            Exercise.findById(image.exercise)
            .then(function(theExercise){
                exercise = theExercise;
                // exercise currently has an image
                if(exercise.image){
                    existingImage = true;
                    return Image.findById(exercise.image);
                }
            }).then(function(theImage){
                if(existingImage){
                    return theImage.remove();
                }
            }).then(function(){
                exercise.image = image;
                return exercise.save();
            }).then(function(){
                return image.save();
            }).then(function(){
                res.json({image: image});
            }).catch(function(err){
                res.send(err);
            });
        }
        else{
            PatientProfile.findById(image.patientProfile)
            .then(function(patientProfile){
                patientProfile.images.push(image._id);
                return patientProfile.save();
            }).then(function(){
                return image.save();
            }).then(function(){
                res.json({image: image});
            }).catch(function(err){
                res.send(err);
            });
        }
    })
    .get(function (req, res) {
        Image.find()
        .then(function(images){
            res.json({image: images});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:image_id')
    .get(function (req, res) {
        Image.findById(req.params.image_id)
        .then(function(image){
            res.json({image: image});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var image;
        Image.findById(req.params.image_id)
        .then(function(theImage){
            if(theImage.patientProfile){
                image = theImage;
                return image.remove();
            }
            else{
                throw new Error('Cannot delete an image that belongs to an Exercise.');
            }
        }).then(function(){
            return PatientProfile.findById(image.patientProfile);
        }).then(function(patientProfile){
            var index = patientProfile.images.indexOf(image._id);
            patientProfile.images.splice(index, 1);
            return patientProfile.save();
        }).then(function(){
            res.json({image: image});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;