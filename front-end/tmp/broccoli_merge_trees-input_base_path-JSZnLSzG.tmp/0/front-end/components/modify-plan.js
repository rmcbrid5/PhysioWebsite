import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    DS: inject('store'),
    exerciseModel: computed(function(){
        return this.get('store').findAll('exercise');
    }),
    formModel: computed(function(){
        return this.get('store').findAll('form');
    }),
    postsData: null,
    title: oneWay('postsData.title'),
    body: oneWay('postsData.body'),
    modalName: computed(function(){
        return 'Modify-Posts' + this.get('ID');
    }),
    actions:{
        addAssessmentTest: function(){
            var model = this.get('assessmentTestModel');
            var obj = {name: 'Assessment Test Name ' + this.get('assessmentTestCount').toString(),
                        description: 'Assessment Test Description ' + this.get('assessmentTestCount').toString(),
                        id: this.get('assessmentTestCount')};
            this.set('assessmentTestCount', this.get('assessmentTestCount') + 1);
            var theMap = this.get('assessmentTestMap');
            theMap[obj.id] = null;
            this.set('assessmentTestMap', theMap);
            model.push(obj);
            this.set('assessmentTestModel', model);
            this.notifyPropertyChange('assessmentTestModel');
        },
        addExercisesList: function(){
            var model = this.get('exercisesListModel');
            var obj = {id: this.get('exercisesListCount')};
            this.set('exercisesListCount', this.get('exercisesListCount') + 1);
            var theMap = this.get('exercisesListMap');
            theMap[obj.id] = null;
            this.set('exercisesListMap', theMap);
            model.push(obj);
            this.set('exercisesListModel', model);
            this.notifyPropertyChange('exercisesListModel');
        },
        openModal: function () {
            var obj = this;
            var DS = this.get('DS');

            this.set('assessmentTestModel', []);
            this.set('exercisesListModel', []);
            this.set('assessmentTestMap', []);    // maps assessmentTests to the form that goes along with them
            this.set('exercisesListMap', []);
            this.set('assessmentTestCount', 0);
            this.set('exercisesListCount', 0);
            this.set('existingAssessmentTests', []);
            this.set('existingExercisesLists', []);

            function findExistingAssessmentTests(index){
                if(index !== rehabilitationPlan.get('assessmentTests').length){
                    DS.findRecord('assessment-test', rehabilitationPlan.get('assessmentTests')[index], {reload: true})
                    .then(function(assessmentTest){
                        var assessmentTestJSON = JSON.parse(JSON.stringify(assessmentTest));
                        assessmentTestJSON.id = assessmentTest.id;
                        var assessmentTests = obj.get('existingAssessmentTests');
                        assessmentTests.push(assessmentTestJSON);
                        obj.set('existingAssessmentTests', assessmentTests);
                    }).then(function(){
                        findExistingAssessmentTests(index + 1);
                    });
                }
                else{
                    findExistingExercisesLists(0);
                }
            }

            function findExistingExercisesLists(index){
                if(index !== rehabilitationPlan.get('exercisesLists').length){
                    DS.findRecord('exercises-list', rehabilitationPlan.get('exercisesLists')[index], {reload: true})
                    .then(function(exercisesList){
                        var exercisesListJSON = JSON.parse(JSON.stringify(exercisesList));
                        exercisesListJSON.id = exercisesList.id;
                        var exercisesLists = obj.get('existingExercisesLists');
                        exercisesLists.push(exercisesListJSON);
                        obj.set('existingExercisesLists', exercisesLists);
                        findExistingExercisesLists(index + 1);
                    });
                }
                else{
                    findExistingExercises(0);
                }
            }

            function findExistingExercises(index){
                if(index !== obj.get('existingExercisesLists').length){
                    DS.findRecord('exercise', obj.get('existingExercisesLists')[index].exercise, {reload: true})
                    .then(function(exercise){
                        var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                        exerciseJSON.id = exercise.id;
                        var theExercisesLists = obj.get('existingExercisesLists');
                        var theExercisesList = theExercisesLists[index];
                        theExercisesList.exercise = exerciseJSON;
                        theExercisesLists[index] = theExercisesList;
                        obj.set('existingExercisesLists', theExercisesLists);
                    }).then(function(){
                        findExistingExercises(index + 1);
                    });
                }
                else{
                    obj.notifyPropertyChange('existingAssessmentTests');
                    obj.notifyPropertyChange('existingExercisesLists');
                }
            }

            var rehabilitationPlan;

            DS.findRecord('rehabilitation-plan', this.get('ID'), {reload: true})
            .then(function(theRehabilitationPlan){
                rehabilitationPlan = theRehabilitationPlan;
                findExistingAssessmentTests(0);
            });

            $('.ui.' + this.get('modalName') +'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var thisPhysiotherapist = this.get('physiotherapist');
                    var thisAssessmentTestMap = this.get('assessmentTestMap');
                    var thisExercisesListMap = this.get('exercisesListMap');
                    var thisAssessmentTestModel = this.get('assessmentTestModel');
                    var thisExercisesListModel = this.get('exercisesListModel');
                    var exerciseIds = [];
                    for(var i = 0; i < thisExercisesListModel.length; i++){
                        var exerciseId = thisExercisesListMap[thisExercisesListModel[i].id];
                        if(!exerciseId){
                            alert('Cannot leave any exercises un-selected.');
                            return false;
                        }
                        else{
                            exerciseIds.push(exerciseId);
                        }
                    }
                    var assessmentTestJSONs = [];
                    for(var i = 0; i < thisAssessmentTestModel.length; i++){
                        var formId = thisAssessmentTestMap[thisAssessmentTestModel[i].id];
                        if(!formId){
                            alert('Cannot leave any assessment tests un-selected.');
                            return false;
                        }
                        else{
                            var assessmentTestJSON = thisAssessmentTestModel[i];
                            assessmentTestJSON.form = formId;
                            assessmentTestJSONs.push(assessmentTestJSON);
                        }
                    }

                    if(!this.get('name')){
                        alert('Name must be non-empty');
                        return false;
                    }

                    for(var i = 0; i < assessmentTestJSONs.length; i++){
                        if(!assessmentTestJSONs[i].name){
                            alert('Name must be non-empty for every assessment test.');
                            return false;
                        }
                    }

                    var oldRehabilitationPlan;
                    var oldAssessmentTests;
                    var oldExercisesLists;

                    function updateAssessmentTests(iIndex, jIndex){
                        if(iIndex !== oldAssessmentTests.length){
                            if(jIndex !== obj.get('existingAssessmentTests').length){
                                if(obj.get('existingAssessmentTests')[jIndex].id === oldAssessmentTests[iIndex]){
                                    DS.findRecord('assessment-test', oldAssessmentTests[iIndex], {reload: true})
                                    .then(function(assessmentTest){
                                        assessmentTest.set('name', obj.get('existingAssessmentTests')[jIndex].name);
                                        assessmentTest.set('description', obj.get('existingAssessmentTests')[jIndex].description);
                                        assessmentTest.save().then(function(){
                                            updateAssessmentTests(iIndex + 1, 0);
                                        });
                                    })
                                }
                                else{
                                    updateAssessmentTests(iIndex, jIndex + 1);
                                }
                            }
                            else{
                                DS.findRecord('assessment-test', oldAssessmentTests[iIndex], {reload: true})
                                .then(function(assessmentTest){
                                    assessmentTest.destroyRecord()
                                    .then(function(){
                                        updateAssessmentTests(iIndex + 1, 0);
                                    })
                                })
                            }
                        }
                    }

                    function updateExercisesLists(iIndex, jIndex){
                        if(iIndex !== oldExercisesLists.length){
                            if(jIndex !== obj.get('existingExercisesLists').length){
                                if(obj.get('existingExercisesLists')[jIndex].id === oldExercisesLists[iIndex]){
                                    updateExercisesLists(iIndex + 1, 0);
                                }
                                else{
                                    updateExercisesLists(iIndex, jIndex + 1);
                                }
                            }
                            else{
                                DS.findRecord('exercises-list', oldExercisesLists[iIndex], {reload: true})
                                .then(function(exercisesList){
                                    exercisesList.destroyRecord()
                                    .then(function(){
                                        updateExercisesLists(iIndex + 1, 0);
                                    });
                                });
                            }
                        }
                    }

                    DS.findRecord('rehabilitation-plan', this.get('ID'), {reload: true})
                    .then(function(rehabilitationPlan){
                        oldAssessmentTests = rehabilitationPlan.get('assessmentTests');
                        oldExercisesLists = rehabilitationPlan.get('exercisesLists');

                        oldRehabilitationPlan = rehabilitationPlan;
                        rehabilitationPlan.set('name', obj.get('name'));
                        rehabilitationPlan.set('description', obj.get('description'));
                        rehabilitationPlan.set('goal', obj.get('goal'));
                        rehabilitationPlan.set('timeFrameToComplete', obj.get('timeFrameToComplete'));
                        return rehabilitationPlan.save();
                    }).then(function(){
                        updateAssessmentTests(0, 0);
                    }).then(function(){
                        updateExercisesLists(0, 0);
                    }).then(function(){
                        for(var i = 0; i < exerciseIds.length; i++){
                            var newExercisesList = DS.createRecord('exercises-list', {
                                rehabilitationPlan: oldRehabilitationPlan.id,
                                exercise: exerciseIds[i]
                            });
                            newExercisesList.save();
                        }
                    }).then(function(){
                        for(var i = 0; i < assessmentTestJSONs.length; i++){
                            var newAssessmentTest = DS.createRecord('assessment-test', {
                                name: assessmentTestJSONs[i].name,
                                description: assessmentTestJSONs[i].description,
                                form: assessmentTestJSONs[i].form,
                                physiotherapist: thisPhysiotherapist,
                                rehabilitationPlan: obj.get('ID')
                            });
                            newAssessmentTest.save();
                        }
                    });
                    return true;
                }
            })
            .modal('show');
        },
        removeExistingAssessmentTest: function(assessmentTest){
            var objModel = this.get('existingAssessmentTests');
            var index = objModel.indexOf(assessmentTest);
            objModel.splice(index, 1);
            this.set('existingAssessmentTests', objModel);
            this.notifyPropertyChange('existingAssessmentTests');
        },
        removeAssessmentTest: function(assessmentTest){
            var objModel = this.get('assessmentTestModel');
            var index = objModel.indexOf(assessmentTest);
            objModel.splice(index, 1);
            this.set('assessmentTestModel', objModel);
            this.notifyPropertyChange('assessmentTestModel');
        },
        removeExistingExercisesList: function(exercisesList){
            var objModel = this.get('existingExercisesLists');
            var index = objModel.indexOf(exercisesList);
            objModel.splice(index, 1);
            this.set('existingExercisesLists', objModel);
            this.notifyPropertyChange('existingExercisesLists');
        },
        removeExercisesList: function(exercisesList){
            var objModel = this.get('exercisesListModel');
            var index = objModel.indexOf(exercisesList);
            objModel.splice(index, 1);
            this.set('exercisesListModel', objModel);
            this.notifyPropertyChange('exercisesListModel');
        },
        selectDate: function(date){
            this.set('timeFrameToComplete', date);
        },
        selectExercise: function(exercisesList, exercise){
            var theMap = this.get('exercisesListMap');
            theMap[exercisesList.id.toString()] = exercise;
            this.set('exercisesListMap', theMap);
        },
        selectForm: function(assessment, form){
            var theMap = this.get('assessmentTestMap');
            theMap[assessment.id.toString()] = form;
            this.set('assessmentTestMap', theMap);
          },
    },
    didInsertElement: function() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function() {
        var table = $('#example').DataTable();
      } );
    }
});