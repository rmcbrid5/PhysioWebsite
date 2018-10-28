var express = require('express');
var router = express.Router();
var Gender = require('../models/gender');
var PatientProfile = require('../models/patientProfile');

router.route('/')
    .post(function (req, res) {
        var gender = new Gender();
        gender.name = req.body.gender.name;
        gender.patientProfiles = [];
        gender.save()
        .then(function(){
            res.json({gender: gender});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        Gender.find()
        .then(function(genders){
            res.json({gender: genders});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:gender_id')
    .get(function (req, res) {
        Gender.findById(req.params.gender_id)
        .then(function(gender){
            res.json({gender: gender});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function (req, res) {
        var gender;
        Gender.findById(req.params.gender_id)
        .then(function(theGender){
            gender = theGender;
            gender.name = req.body.gender.name;
            return gender.save();
        }).then(function(){
            res.json({gender: gender});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var gender;
        Gender.findById(req.params.gender_id)
        .then(function(theGender){
            gender = theGender;
            return gender.remove();
        }).then(function(){
            var patientProfile;

            function setGendersNull(index){
                if(index !== gender.patientProfiles.length){
                    return PatientProfile.findById(gender.patientProfiles[index])
                    .then(function(patientProfile){
                        patientProfile.gender = null;
                        return patientProfile.save();
                    }).then(function(){
                        return setGendersNull(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return setGendersNull(0);
        }).then(function(){
            res.json({gender: gender});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;