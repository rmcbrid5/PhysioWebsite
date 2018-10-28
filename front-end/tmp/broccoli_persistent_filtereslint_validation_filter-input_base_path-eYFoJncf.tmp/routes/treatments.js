import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    store: service(),
    router: service(),
    beforeModel(){
      if(this.get('oudaAuth').getRole() !== 'pa'){
        this.get('router').transitionTo('home');
      }
    },
    model(){
        var self = this;
        var myStore = this.get('store');
        var authentication = this.get('oudaAuth');

        var treatmentsJSON = [];

        var treatmentsMap = []; // treatment id's -> treatment
        var rehabilitationPlansMap = [];    // rehabilitationPlan id's -> rehabilitationPlan
        var assessmentTestsMap = [];    // assessmentTest id's -> assessmentTest
        var formsMap = [];  // form id's -> form
        var questionsListsMap = []; // questionsList id's -> questionsList
        var questionsMap = [];  // question id's -> questions
        var questionTypesMap = [];  // questionType id's -> questionTypes
        var exercisesListsMap = []; // exercisesList id's -> exercisesLists
        var exercisesMap = [];   // exercises id's -> exercises
        var imagesMap = []; // image id's -> images

        return myStore.findAll('treatment', {reload: true})
        .then(function(treatments){
            treatments.forEach(function(treatment){
                if(treatment.get('patientProfile') === authentication.getPerson()){
                    var treatmentJSON = JSON.parse(JSON.stringify(treatment));
                    treatmentJSON.id = treatment.id;
                    treatmentsMap[treatmentJSON.id] = treatmentJSON;
                    rehabilitationPlansMap[treatmentJSON.rehabilitationPlan] = 1;
                }
            });
            return myStore.findAll('rehabilitation-plan', {reload: true});
        }).then(function(rehabilitationPlans){
            rehabilitationPlans.forEach(function(rehabilitationPlan){
                if(rehabilitationPlansMap[rehabilitationPlan.id]){
                    var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                    rehabilitationPlanJSON.id = rehabilitationPlan.id;
                    rehabilitationPlansMap[rehabilitationPlan.id] = rehabilitationPlanJSON;
                    for(var i = 0; i < rehabilitationPlanJSON.assessmentTests.length; i++){
                        assessmentTestsMap[rehabilitationPlanJSON.assessmentTests[i]] = 1;
                    }
                    for(var i = 0; i < rehabilitationPlanJSON.exercisesLists.length; i++){
                        exercisesListsMap[rehabilitationPlanJSON.exercisesLists[i]] = 1;
                    }
                }
            });
            return myStore.findAll('assessment-test', {reload: true});
        }).then(function(assessmentTests){
            assessmentTests.forEach(function(assessmentTest){
                if(assessmentTestsMap[assessmentTest.id]){
                    var assessmentTestJSON = JSON.parse(JSON.stringify(assessmentTest));
                    assessmentTestJSON.id = assessmentTest.id;
                    assessmentTestsMap[assessmentTest.id] = assessmentTestJSON;
                    formsMap[assessmentTestJSON.form] = 1;
                }
            });
            return myStore.findAll('form', {reload: true});
        }).then(function(forms){
            forms.forEach(function(form){
                if(formsMap[form.id]){
                    var formJSON = JSON.parse(JSON.stringify(form));
                    formJSON.id = form.id;
                    formsMap[form.id] = formJSON;
                    for(var i = 0; i < formJSON.questionsLists.length; i++){
                        questionsListsMap[formJSON.questionsLists[i]] = 1;
                    }
                }
            });
            return myStore.findAll('questions-list', {reload: true});
        }).then(function(questionsLists){
            questionsLists.forEach(function(questionsList){
                if(questionsListsMap[questionsList.id]){
                    var questionsListJSON = JSON.parse(JSON.stringify(questionsList));
                    questionsListJSON.id = questionsList.id;
                    questionsListsMap[questionsList.id] = questionsListJSON;
                    questionsMap[questionsListJSON.question] = 1;
                }
            });
            return myStore.findAll('question', {reload: true});
        }).then(function(questions){
            questions.forEach(function(question){
                if(questionsMap[question.id]){
                    var questionJSON = JSON.parse(JSON.stringify(question));
                    questionJSON.id = question.id;
                    questionsMap[question.id] = questionJSON;
                    questionTypesMap[questionJSON.questionType] = 1;
                }
            });
            return myStore.findAll('question-type', {reload: true});
        }).then(function(questionTypes){
            questionTypes.forEach(function(questionType){
                if(questionTypesMap[questionType.id]){
                    var questionTypeJSON = JSON.parse(JSON.stringify(questionType));
                    questionTypeJSON.id = questionType.id;
                    questionTypesMap[questionType.id] = questionTypeJSON;
                }
            });
            return myStore.findAll('exercises-list', {reload: true});
        }).then(function(exercisesLists){
            exercisesLists.forEach(function(exercisesList){
                if(exercisesListsMap[exercisesList.id]){
                    var exercisesListJSON = JSON.parse(JSON.stringify(exercisesList));
                    exercisesListJSON.id = exercisesList.id;
                    exercisesListsMap[exercisesList.id] = exercisesListJSON;
                    exercisesMap[exercisesListJSON.exercise] = 1;
                }
            });
            return myStore.findAll('exercise', {reload: true});
        }).then(function(exercises){
            exercises.forEach(function(exercise){
                if(exercisesMap[exercise.id]){
                    var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                    exerciseJSON.id = exercise.id;
                    exercisesMap[exercise.id] = exerciseJSON;
                    imagesMap[exerciseJSON.image] = 1;
                }
            });
            return myStore.findAll('image', {reload: true});
        }).then(function(images){
            images.forEach(function(image){
                if(imagesMap[image.id]){
                    var imageJSON = JSON.parse(JSON.stringify(image));
                    imageJSON.id = image.id;
                    imagesMap[image.id] = imageJSON;
                }
            });
            var replacement = [];
            for(var key in questionTypesMap){
                if(questionTypesMap.hasOwnProperty(key)){
                    for(var i = 0; i < questionTypesMap[key].questions.length; i++){
                        questionTypesMap[key].questions[i] = questionsMap[questionTypesMap[key].questions[i]];
                    }
                }
            }
            for(var key in questionsMap){
                if(questionsMap.hasOwnProperty(key)){
                    questionsMap[key].questionType = questionTypesMap[questionsMap[key].questionType];
                    for(var i = 0; i < questionsMap[key].questionsLists.length; i++){
                        questionsMap[key].questionsLists[i] = questionsListsMap[questionsMap[key].questionsLists[i]];
                    }
                }
            }
            for(var key in questionsListsMap){
                if(questionsListsMap.hasOwnProperty(key)){
                    questionsListsMap[key].question = questionsMap[questionsListsMap[key].question];
                    questionsListsMap[key].form = formsMap[questionsListsMap[key].form];
                }
            }
            for(var key in formsMap){
                if(formsMap.hasOwnProperty(key)){
                    for(var i = 0; i < formsMap[key].questionsLists.length; i++){
                        formsMap[key].questionsLists[i] = questionsListsMap[formsMap[key].questionsLists[i]];
                    }
                    for(var i = 0; i < formsMap[key].assessmentTests.length; i++){
                        formsMap[key].assessmentTests[i] = assessmentTestsMap[formsMap[key].assessmentTests[i]];
                    }
                }
            }
            for(var key in assessmentTestsMap){
                if(assessmentTestsMap.hasOwnProperty(key)){
                    assessmentTestsMap[key].form = formsMap[assessmentTestsMap[key].form];
                    assessmentTestsMap[key].rehabilitationPlan = rehabilitationPlansMap[assessmentTestsMap[key].rehabilitationPlan];
                }
            }
            for(var key in rehabilitationPlansMap){
                if(rehabilitationPlansMap.hasOwnProperty(key)){
                    for(var i = 0; i < rehabilitationPlansMap[key].assessmentTests.length; i++){
                        rehabilitationPlansMap[key].assessmentTests[i] = assessmentTestsMap[rehabilitationPlansMap[key].assessmentTests[i]];
                    }
                    for(var i = 0; i < rehabilitationPlansMap[key].exercisesLists.length; i++){
                        rehabilitationPlansMap[key].exercisesLists[i] = exercisesListsMap[rehabilitationPlansMap[key].exercisesLists[i]];
                    }
                    for(var i = 0; i < rehabilitationPlansMap[key].treatments.length; i++){
                        rehabilitationPlansMap[key].treatments[i] = treatmentsMap[rehabilitationPlansMap[key].treatments[i]];
                    }
                }
            }
            for(var key in exercisesListsMap){
                if(exercisesListsMap.hasOwnProperty(key)){
                    exercisesListsMap[key].rehabilitationPlan = rehabilitationPlansMap[exercisesListsMap[key].rehabilitationPlan];
                    exercisesListsMap[key].exercise = exercisesMap[exercisesListsMap[key].exercise];
                }
            }
            for(var key in exercisesMap){
                if(exercisesMap.hasOwnProperty(key)){
                    exercisesMap[key].image = imagesMap[exercisesMap[key].image];
                    for(var i = 0; i < exercisesMap[key].exercisesLists.length; i++){
                        exercisesMap[key].exercisesLists[i] = exercisesListsMap[exercisesMap[key].exercisesLists[i]];
                    }
                }
            }
            for(var key in imagesMap){
                if(imagesMap.hasOwnProperty(key)){
                    imagesMap[key].exercise = exercisesMap[imagesMap[key].exercise];
                }
            }
            for(var key in treatmentsMap){
                if(treatmentsMap.hasOwnProperty(key)){
                    treatmentsMap[key].rehabilitationPlan = rehabilitationPlansMap[treatmentsMap[key].rehabilitationPlan];
                    treatmentsJSON.push(treatmentsMap[key]);
                }
            }
            return treatmentsJSON;
        });
    }
});
