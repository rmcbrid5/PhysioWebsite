var express = require('express');
var router = express.Router();
var Country = require('../models/country');
var PatientProfile = require('../models/patientProfile');

router.route('/')
    .post(function (req, res) {
        var country = new Country();
        country.name = req.body.country.name;
        country.patientProfiles = [];
        country.save()
        .then(function(){
            res.json({country: country});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        Country.find()
        .then(function(countries){
            res.json({country: countries});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:country_id')
    .get(function (req, res) {
        Country.findById(req.params.country_id)
        .then(function(country){
            res.json({country: country});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function (req, res) {
        Country.findById(req.params.country_id)
        .then(function(country){
            country.name = req.body.country.name;
            return country.save();
        }).then(function(){
            res.json({country: country});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var country;
        Country.findById(req.params.country_id)
        .then(function(theCountry){
            country = theCountry;
            return country.remove();
        }).then(function(){
            var patientProfile;

            function setCountriesNull(index){
                if(index !== country.patientProfiles.length){
                    return PatientProfile.findById(country.patientProfiles[index])
                    .then(function(patientProfile){
                        patientProfile.country = null;
                        return patientProfile.save();
                    }).then(function(){
                        return setCountriesNull(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return setCountriesNull(0);
        }).then(function(){
            res.json({country: country});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;