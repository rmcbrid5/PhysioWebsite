define('front-end/components/add-new-plan', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        exerciseModel: Ember.computed(function () {
            return this.get('store').findAll('exercise');
        }),
        formModel: Ember.computed(function () {
            return this.get('store').findAll('form');
        }),
        physiotherapistModel: Ember.computed(function () {
            return this.get('store').findAll('physiotherapist');
        }),
        modalName: Ember.computed(function () {
            return 'Modify-Plan' + this.get('ID');
        }),
        actions: {
            addAssessmentTest: function addAssessmentTest() {
                var model = this.get('assessmentTestModel');
                var obj = { name: 'Assessment Test Name ' + this.get('assessmentTestCount').toString(),
                    description: 'Assessment Test Description ' + this.get('assessmentTestCount').toString(),
                    id: this.get('assessmentTestCount') };
                this.set('assessmentTestCount', this.get('assessmentTestCount') + 1);
                var theMap = this.get('assessmentTestMap');
                theMap[obj.id] = null;
                this.set('assessmentTestMap', theMap);
                model.push(obj);
                this.set('assessmentTestModel', model);
                this.notifyPropertyChange('assessmentTestModel');
            },
            addExercisesList: function addExercisesList() {
                var model = this.get('exercisesListModel');
                var obj = { id: this.get('exercisesListCount') };
                this.set('exercisesListCount', this.get('exercisesListCount') + 1);
                var theMap = this.get('exercisesListMap');
                theMap[obj.id] = null;
                this.set('exercisesListMap', theMap);
                model.push(obj);
                this.set('exercisesListModel', model);
                this.notifyPropertyChange('exercisesListModel');
            },
            openModal: function openModal() {
                var _this = this;

                var self = this;
                this.set('name', null);
                this.set('description', null);
                this.set('goal', null);
                this.set('exercises', null);
                this.set('forms', null);
                this.set('assessmentTestModel', []);
                this.set('exercisesListModel', []);
                this.set('assessmentTestMap', []); // maps assessmentTests to the form that goes along with them
                this.set('exercisesListMap', []);
                this.set('assessmentTestCount', 0);
                this.set('exercisesListCount', 0);
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var DS = _this.get('DS');
                        var thisAssessmentTestMap = _this.get('assessmentTestMap');
                        var thisExercisesListMap = _this.get('exercisesListMap');
                        var thisAssessmentTestModel = _this.get('assessmentTestModel');
                        var thisExercisesListModel = _this.get('exercisesListModel');
                        var exerciseIds = [];
                        for (var i = 0; i < thisExercisesListModel.length; i++) {
                            var exerciseId = thisExercisesListMap[thisExercisesListModel[i].id];
                            if (!exerciseId) {
                                alert('Cannot leave any exercises un-selected.');
                                return false;
                            } else {
                                exerciseIds.push(exerciseId);
                            }
                        }
                        var assessmentTestJSONs = [];
                        for (var i = 0; i < thisAssessmentTestModel.length; i++) {
                            var formId = thisAssessmentTestMap[thisAssessmentTestModel[i].id];
                            if (!formId) {
                                alert('Cannot leave any assessment tests un-selected.');
                                return false;
                            } else {
                                var assessmentTestJSON = thisAssessmentTestModel[i];
                                assessmentTestJSON.form = formId;
                                assessmentTestJSONs.push(assessmentTestJSON);
                            }
                        }

                        if (!_this.get('name')) {
                            alert('Name must be non-empty');
                            return false;
                        }
                        for (var i = 0; i < assessmentTestJSONs.length; i++) {
                            if (!assessmentTestJSONs[i].name) {
                                alert('Name must be non-empty for every assessment test.');
                                return false;
                            }
                        }
                        var newRehabilitationPlan = DS.createRecord('rehabilitation-plan', {
                            name: _this.get('name'),
                            description: _this.get('description'),
                            physiotherapist: self.get('oudaAuth').getPerson(),
                            goal: _this.get('goal')
                        });
                        newRehabilitationPlan.save().then(function () {
                            for (var i = 0; i < exerciseIds.length; i++) {
                                var newExercisesList = DS.createRecord('exercises-list', {
                                    rehabilitationPlan: newRehabilitationPlan.id,
                                    exercise: exerciseIds[i]
                                });
                                newExercisesList.save();
                            }
                        }).then(function () {
                            for (var i = 0; i < assessmentTestJSONs.length; i++) {
                                var newAssessmentTest = DS.createRecord('assessment-test', {
                                    name: assessmentTestJSONs[i].name,
                                    description: assessmentTestJSONs[i].description,
                                    form: thisAssessmentTestMap[assessmentTestJSONs[i].id],
                                    rehabilitationPlan: newRehabilitationPlan.id
                                });
                                newAssessmentTest.save();
                            }
                        });
                        return true;
                    }
                }).modal('show');
            },
            removeAssessmentTest: function removeAssessmentTest(assessmentTest) {
                var objModel = this.get('assessmentTestModel');
                var index = objModel.indexOf(assessmentTest);
                objModel.splice(index, 1);
                this.set('assessmentTestModel', objModel);
                this.notifyPropertyChange('assessmentTestModel');
            },
            removeExercisesList: function removeExercisesList(exercisesList) {
                var objModel = this.get('exercisesListModel');
                var index = objModel.indexOf(exercisesList);
                objModel.splice(index, 1);
                this.set('exercisesListModel', objModel);
                this.notifyPropertyChange('exercisesListModel');
            },
            selectDate: function selectDate(date) {
                this.set('timeFrameToComplete', date);
            },
            selectExercise: function selectExercise(exercisesList, exercise) {
                var theMap = this.get('exercisesListMap');
                theMap[exercisesList.id.toString()] = exercise;
                this.set('exercisesListMap', theMap);
            },
            selectForm: function selectForm(assessment, form) {
                var theMap = this.get('assessmentTestMap');
                theMap[assessment.id.toString()] = form;
                this.set('assessmentTestMap', theMap);
            }
        }
    });
});