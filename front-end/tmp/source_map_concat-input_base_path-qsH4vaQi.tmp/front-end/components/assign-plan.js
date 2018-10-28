define('front-end/components/assign-plan', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        rehabilitationPlanModel: Ember.computed(function () {
            return this.get('store').findAll('rehabilitation-plan');
        }),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            addTreatment: function addTreatment() {
                var model = this.get('treatmentModel');
                var obj = { id: this.get('treatmentCount') };
                this.set('treatmentCount', this.get('treatmentCount') + 1);
                var theMap = this.get('treatmentMap');
                theMap[obj.id] = { rehabilitationPlan: null, physiotherapist: null };
                this.set('treatmentMap', theMap);
                model.push(obj);
                this.set('treatmentModel', model);
                this.notifyPropertyChange('treatmentModel');
            },
            openModal: function openModal() {
                var _this = this;

                var self = this;

                var obj = this;
                var DS = this.get('DS');

                function findExistingTreatments(index) {
                    if (index !== obj.get('existingTreatments').length) {
                        DS.findRecord('treatment', obj.get('existingTreatments')[index], { reload: true }).then(function (treatment) {
                            var treatmentJSON = JSON.parse(JSON.stringify(treatment));
                            treatmentJSON.id = treatment.id;
                            var model = obj.get('existingTreatments');
                            model[index] = treatmentJSON;
                            obj.set('existingTreatments', model);
                            findExistingTreatments(index + 1);
                        });
                    } else {
                        findExistingRehabilitationPlans(0);
                    }
                }

                function findExistingRehabilitationPlans(index) {
                    if (index !== obj.get('existingTreatments').length) {
                        DS.findRecord('rehabilitation-plan', obj.get('existingTreatments')[index].rehabilitationPlan, { reload: true }).then(function (rehabilitationPlan) {
                            var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                            rehabilitationPlanJSON.id = rehabilitationPlan.id;
                            var model = obj.get('existingTreatments');
                            model[index].rehabilitationPlan = rehabilitationPlanJSON;
                            findExistingRehabilitationPlans(index + 1);
                        });
                    } else {
                        obj.notifyPropertyChange('existingTreatments');
                    }
                }

                this.set('treatmentMap', []);
                this.set('treatmentModel', []);
                this.set('existingTreatments', []);
                this.set('treatmentCount', 0);

                DS.findRecord('patient-profile', this.get('ID'), { reload: true }).then(function (patientProfile) {
                    obj.set('existingTreatments', patientProfile.get('treatments'));
                    findExistingTreatments(0);
                });

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var obj = _this;
                        var DS = _this.get('DS');
                        var thisTreatmentModel = _this.get('treatmentModel');
                        var thisTreatmentMap = _this.get('treatmentMap');
                        var rehabilitationPlanIds = [];
                        var physiotherapistIds = [];

                        for (var i = 0; i < thisTreatmentModel.length; i++) {
                            var rehabilitationPlanId = thisTreatmentMap[thisTreatmentModel[i].id].rehabilitationPlan;
                            if (!rehabilitationPlanId) {
                                alert('Cannot leave any Rehabilitation Plans un-selected.');
                                return false;
                            } else {
                                rehabilitationPlanIds.push(rehabilitationPlanId);
                            }
                        }

                        function updateTreatments(iIndex, jIndex) {
                            if (iIndex !== oldTreatments.length) {
                                if (jIndex !== obj.get('existingTreatments').length) {
                                    if (obj.get('existingTreatments')[jIndex].id === oldTreatments[iIndex]) {
                                        updateTreatments(iIndex + 1, 0);
                                    } else {
                                        updateTreatments(iIndex, jIndex + 1);
                                    }
                                } else {
                                    DS.findRecord('treatment', oldTreatments[iIndex], { reload: true }).then(function (treatment) {
                                        treatment.destroyRecord().then(function () {
                                            updateTreatments(iIndex + 1, 0);
                                        });
                                    });
                                }
                            }
                        }

                        var oldTreatments;

                        DS.findRecord('patient-profile', _this.get('ID'), { reload: true }).then(function (patientProfile) {
                            oldTreatments = patientProfile.get('treatments');
                            updateTreatments(0, 0);
                        }).then(function () {
                            for (var i = 0; i < thisTreatmentModel.length; i++) {
                                var newTreatment = DS.createRecord('treatment', {
                                    dateAssigned: new Date(),
                                    physiotherapist: self.get('oudaAuth').getPerson(),
                                    rehabilitationPlan: thisTreatmentMap[thisTreatmentModel[i].id].rehabilitationPlan,
                                    patientProfile: obj.get('ID')
                                });
                                newTreatment.save();
                            }
                        });
                    }
                }).modal('show');
            },
            removeExistingTreatment: function removeExistingTreatment(treatment) {
                var objModel = this.get('existingTreatments');
                var index = objModel.indexOf(treatment);
                objModel.splice(index, 1);
                this.set('existingTreatments', objModel);
                this.notifyPropertyChange('existingTreatments');
            },
            removeTreatment: function removeTreatment(treatment) {
                var objModel = this.get('treatmentModel');
                var index = objModel.indexOf(treatment);
                objModel.splice(index, 1);
                this.set('treatmentModel', objModel);
                this.notifyPropertyChange('treatmentModel');
            },
            selectPhysiotherapist: function selectPhysiotherapist(treatment, physiotherapist) {
                var theMap = this.get('treatmentMap');
                theMap[treatment.id.toString()].physiotherapist = physiotherapist;
                this.set('treatmentMap', theMap);
                this.notifyPropertyChange('treatmentMap');
            },
            selectRehabilitationPlan: function selectRehabilitationPlan(treatment, rehabilitationPlan) {
                var theMap = this.get('treatmentMap');
                theMap[treatment.id.toString()].rehabilitationPlan = rehabilitationPlan;
                this.set('treatmentMap', theMap);
                this.notifyPropertyChange('treatmentMap');
            }
        },
        didInsertElement: function didInsertElement() {
            /* Init the table and fire off a call to get the hidden nodes. */
            Ember.$(document).ready(function () {
                var table = Ember.$('#example').DataTable();
            });
        }
    });
});