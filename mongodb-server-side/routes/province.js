var express = require('express');
var router = express.Router();
var Province = require('../models/province');

router.route('/')
    .post(function (req, res) {
        var province = new Province();
        province.name = req.body.province.name;
        province.patientProfiles = [];
        province.save()
        .then(function(){
            res.json({province: province});
        }).catch(function(err){
            res.send(err);
        });
    })
    .get(function (req, res) {
        Province.find()
        .then(function(provinces){
            res.json({province: provinces});
        }).catch(function(err){
            res.send(err);
        });
    });
    
router.route('/:province_id')
    .get(function (req, res) {
        Province.findById(req.params.province_id)
        .then(function(provinces){
            res.json({province: provinces});
        }).catch(function(err){
            res.send(err);
        });
    })
    .put(function (req, res) {
        var province;
        Province.findById(req.params.province_id)
        .then(function(theProvince){
            province = theProvince;
            province.name = req.body.province.name;
            return province.save();
        }).then(function(){
            res.json({province: province});
        }).catch(function(err){
            res.send(err);
        });
    })
    .delete(function (req, res) {
        var province;
        Province.findById(req.params.province_id)
        .then(function(theProvince){
            province = theProvince;
            return province.remove();
        }).then(function(){
            var patientProfile;

            function setProvincesNull(index){
                if(index !== province.patientProfiles.length){
                    return PatientProfile.findById(province.patientProfiles[index])
                    .then(function(patientProfile){
                        patientProfile.province = null;
                        return patientProfile.save();
                    }).then(function(){
                        return setProvincesNull(index + 1);
                    }).catch(function(err){
                        throw new Error(err);
                    });
                }
            }

            return setProvincesNull(0);
        }).then(function(){
            res.json({province: province});
        }).catch(function(err){
            res.send(err);
        });
    })
    
module.exports = router;