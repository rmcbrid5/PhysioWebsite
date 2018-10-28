var express = require('express');
var router = express.Router();
var City = require('../models/city');
var PatientProfile = require('../models/patientProfile');

router.route('/')
    .post(function (req, res) {
        var city = new City();
        city.name = req.body.city.name;
        city.patientProfiles = [];
        city.save()
        .then(function(){
            res.json({city: city});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        City.find()
        .then(function(cities){
            res.json({city: cities});
        }).catch(function(err){
            res.send(err);
        });
    });

router.route('/:city_id')
    .get(function (req, res) {
        City.findById(req.params.city_id)
        .then(function(city){
            res.json({city: city});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function (req, res) {
        City.findById(req.params.city_id)
        .then(function(city){
            city.name = req.body.city.name;
            return city.save();
        }).then(function(){
            res.json({city: city});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var city;
        City.findById(req.params.city_id)
        .then(function(theCity){
            city = theCity;
            return city.remove();
        }).then(function(){
            var patientProfile;

            function setCitiesNull(index){
                if(index !== city.patientProfiles.length){
                    return PatientProfile.findById(city.patientProfiles[index])
                    .then(function(patientProfile){
                        patientProfile.city = null;
                        return patientProfile.save();
                    }).then(function(){
                        return setCitiesNull(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return setCitiesNull(0);
        }).then(function(){
            res.json({city: city});
        }).catch(function(err){
            res.send(err);
        });
    });

module.exports = router;