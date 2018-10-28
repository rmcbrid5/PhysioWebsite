import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
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
    physiotherapistModel: computed(function(){
        return this.get('store').findAll('physiotherapist');
    }),
    modalName: computed(function(){
        return 'Modify-Plan' + this.get('ID');
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
            var self = this;
            this.set('name', null);
            this.set('description', null);
            this.set('goal', null);
            this.set('exercises', null);
            this.set('forms', null);
            this.set('assessmentTestModel', []);
            this.set('exercisesListModel', []);
            this.set('assessmentTestMap', []);    // maps assessmentTests to the form that goes along with them
            this.set('exercisesListMap', []);
            this.set('assessmentTestCount', 0);
            this.set('exercisesListCount', 0);
            $('.ui.' + this.get('modalName') +  '.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var DS = this.get('DS');
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
                    var newRehabilitationPlan = DS.createRecord('rehabilitation-plan', {
                        name: this.get('name'),
                        description: this.get('description'),
                        physiotherapist: self.get('oudaAuth').getPerson(),
                        goal: this.get('goal')
                    });
                    newRehabilitationPlan.save()
                    .then(function(){
                        for(var i = 0; i < exerciseIds.length; i++){
                            var newExercisesList = DS.createRecord('exercises-list', {
                                rehabilitationPlan: newRehabilitationPlan.id,
                                exercise: exerciseIds[i]
                            });
                            newExercisesList.save();
                        }
                    }).then(function(){
                        for(var i = 0; i < assessmentTestJSONs.length; i++){
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
            })
            .modal('show');
        },
        removeAssessmentTest: function(assessmentTest){
            var objModel = this.get('assessmentTestModel');
            var index = objModel.indexOf(assessmentTest);
            objModel.splice(index, 1);
            this.set('assessmentTestModel', objModel);
            this.notifyPropertyChange('assessmentTestModel');
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
        }
    }
});
