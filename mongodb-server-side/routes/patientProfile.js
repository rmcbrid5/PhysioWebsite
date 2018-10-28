/*
Segment done by Kevin Freeman 
kfreem4@uwo.ca
*/

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var Administrator = require('../models/administrator');
var PatientProfile = require('../models/patientProfile');
var Physiotherapist = require('../models/physiotherapist');
var UserAccount = require('../models/userAccount');

var saltRounds = 10;

router.route('/') 
    .post(function(req, res){
        var patientProfile = new PatientProfile();
        var email = req.body.patientProfile.email.toLowerCase();
        Administrator.find({email: email})
        .then(function(administrators){
            if(administrators.length != 0){
                throw new Error('Email already exists in Administrator.');
            }
            else{
                return Physiotherapist.find({email: email});
            }
        }).then(function(physiotherapists){
            if(physiotherapists.length != 0){
                throw new Error('Email already exists in Physiotherapist.');
            }
            else{
                return PatientProfile.find({email: email});
            }
        }).then(function(patientProfiles){
            if(patientProfiles.length != 0){
                throw new Error('Email already exists in PatientProfile.');
            }
            else{
                patientProfile.familyName = req.body.patientProfile.familyName;
                patientProfile.givenName = req.body.patientProfile.givenName;
                patientProfile.email = email;
                patientProfile.userAccount = null;
                patientProfile.DOB = new Date(req.body.patientProfile.DOB);
                patientProfile.postalCode = req.body.patientProfile.postalCode;
                patientProfile.phone = req.body.patientProfile.phone;
                patientProfile.country = req.body.patientProfile.country;
                patientProfile.province = req.body.patientProfile.province;
                patientProfile.city = req.body.patientProfile.city;
                patientProfile.gender = req.body.patientProfile.gender;
                patientProfile.appointments = [];
                patientProfile.treatments = [];
                patientProfile.payments = [];
                patientProfile.images = [];
                patientProfile.enabled = true;
                return patientProfile.save();
            }
        }).then(function(){
            res.json({patientProfile: patientProfile});
        }).catch(function(err){
            res.send(err);
        });
    })
    
    .get(function(req, res){
        PatientProfile.find()
        .then(function(patientProfiles){
            res.json({patientProfile: patientProfiles});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:patientProfile_id')
    .get(function (req, res) {
        PatientProfile.findById(req.params.patientProfile_id)
        .then(function(patientProfile){
            res.json({patientProfile: patientProfile});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function(req, res){
        var patientProfile;
        PatientProfile.findById(req.params.patientProfile_id)
        .then(function(thePatientProfile){
            patientProfile = thePatientProfile;
            patientProfile.familyName = req.body.patientProfile.familyName;
            patientProfile.givenName = req.body.patientProfile.givenName;
            patientProfile.postalCode = req.body.patientProfile.postalCode;
            patientProfile.phone = req.body.patientProfile.phone;
            patientProfile.country = req.body.patientProfile.country;
            patientProfile.province = req.body.patientProfile.province;
            patientProfile.city = req.body.patientProfile.city;
            patientProfile.gender = req.body.patientProfile.gender;
            patientProfile.enabled = req.body.patientProfile.enabled;
            return patientProfile.save();
        }).then(function(){
            res.json({patientProfile: patientProfile});
        }).catch(function(err){
            res.send(err);
        });
    });
    
module.exports = router;