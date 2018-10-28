import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
    model(){
      var self = this;
      var myStore = this.get('store');

      var patientProfilesJSON = [];

      var userAccountsMap = [];
      var treatmentsMap = [];
      var rehabilitationPlansMap = [];
      var exercisesListsMap = [];
      var exercisesMap = [];
      var assessmentTestsMap = [];
      var testResultsMap = [];
      var recommendationsMap = [];

      return myStore.findAll('patient-profile', {reload: true})
      .then(function(patientProfiles){
        patientProfiles.forEach(function(patientProfile){
          var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
          patientProfileJSON.id = patientProfile.id;
          patientProfilesJSON.push(patientProfileJSON);
          userAccountsMap[patientProfileJSON.userAccount] = 1;
          for(var i = 0; i < patientProfileJSON.treatments.length; i++){
            treatmentsMap[patientProfileJSON.treatments[i]] = 1;
          }
        });
        return myStore.findAll('user-account', {reload: true});
      }).then(function(userAccounts){
        userAccounts.forEach(function(userAccount){
          if(userAccountsMap[userAccount.id]){
            var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
            userAccountJSON.id = userAccount.id;
            userAccountsMap[userAccount.id] = userAccountJSON;
          }
        });
        return myStore.findAll('treatment', {reload: true});
      }).then(function(treatments){
        treatments.forEach(function(treatment){
          if(treatmentsMap[treatment.id]){
            var treatmentJSON = JSON.parse(JSON.stringify(treatment));
            treatmentJSON.id = treatment.id;
            treatmentsMap[treatment.id] = treatmentJSON;
            rehabilitationPlansMap[treatmentJSON.rehabilitationPlan] = 1;
            for(var i = 0; i < treatmentJSON.recommendations.length; i++){
              recommendationsMap[treatmentJSON.recommendations[i]] = 1;
            }
          }
        });
        return myStore.findAll('rehabilitation-plan', {reload: true});
      }).then(function(rehabilitationPlans){
        rehabilitationPlans.forEach(function(rehabilitationPlan){
          if(rehabilitationPlansMap[rehabilitationPlan.id]){
            var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
            rehabilitationPlanJSON.id = rehabilitationPlan.id;
            rehabilitationPlansMap[rehabilitationPlan.id] = rehabilitationPlanJSON;
            for(var i = 0; i < rehabilitationPlanJSON.exercisesLists.length; i++){
              exercisesListsMap[rehabilitationPlanJSON.exercisesLists[i]] = 1;
            }
            for(var i = 0; i < rehabilitationPlanJSON.assessmentTests.length; i++){
              assessmentTestsMap[rehabilitationPlanJSON.assessmentTests[i]] = 1;
            }
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
          }
        });
        return myStore.findAll('assessment-test', {reload: true});
      }).then(function(assessmentTests){
        assessmentTests.forEach(function(assessmentTest){
          if(assessmentTestsMap[assessmentTest.id]){
            var assessmentTestJSON = JSON.parse(JSON.stringify(assessmentTest));
            assessmentTestJSON.id = assessmentTest.id;
            assessmentTestsMap[assessmentTest.id] = assessmentTestJSON;
            for(var i = 0; i < assessmentTestJSON.testResults.length; i++){
              testResultsMap[assessmentTestJSON.testResults[i]] = 1;
            }
            for(var i = 0; i < assessmentTestJSON.recommendations.length; i++){
              recommendationsMap[assessmentTestJSON.recommendations[i]] = 1;
            }
          }
        });
        return myStore.findAll('test-result', {reload: true});
      }).then(function(testResults){
        testResults.forEach(function(testResult){
          if(testResultsMap[testResult.id]){
            var testResultJSON = JSON.parse(JSON.stringify(testResult));
            testResultJSON.id = testResult.id;
            testResultsMap[testResult.id] = testResultJSON;
          }
        });
        return myStore.findAll('recommendation', {reload: true});
      }).then(function(recommendations){
        recommendations.forEach(function(recommendation){
          if(recommendationsMap[recommendation.id]){
            var recommendationJSON = JSON.parse(JSON.stringify(recommendation));
            recommendationJSON.id = recommendation.id;
            recommendationsMap[recommendation.id] = recommendationJSON;
          }
        });
        for(var key in assessmentTestsMap){
          if(assessmentTestsMap.hasOwnProperty(key)){
            for(var i = 0; i < assessmentTestsMap[key].testResults.length; i++){
              assessmentTestsMap[key].testResults[i] = testResultsMap[assessmentTestsMap[key].testResults[i]];
            }
            for(var i = 0; i < assessmentTestsMap[key].recommendations.length; i++){
              assessmentTestsMap[key].recommendations[i] = recommendationsMap[assessmentTestsMap[key].recommendations[i]];
            }
            assessmentTestsMap[key].rehabilitationPlan = rehabilitationPlansMap[assessmentTestsMap[key].rehabilitationPlan];
          }
        }
        for(var key in exercisesListsMap){
          if(exercisesListsMap.hasOwnProperty(key)){
            exercisesListsMap[key].exercise = exercisesMap[exercisesListsMap[key].exercise];
          }
        }
        for(var key in rehabilitationPlansMap){
          if(rehabilitationPlansMap.hasOwnProperty(key)){
            for(var i = 0; i < rehabilitationPlansMap[key].exercisesLists.length; i++){
              rehabilitationPlansMap[key].exercisesLists[i] = exercisesListsMap[rehabilitationPlansMap[key].exercisesLists[i]];
            }
            for(var i = 0; i < rehabilitationPlansMap[key].assessmentTests.length; i++){
              rehabilitationPlansMap[key].assessmentTests[i] = assessmentTestsMap[rehabilitationPlansMap[key].assessmentTests[i]];
            }
          }
        }
        for(var key in treatmentsMap){
          if(treatmentsMap.hasOwnProperty(key)){
            treatmentsMap[key].rehabilitationPlan = rehabilitationPlansMap[treatmentsMap[key].rehabilitationPlan];
            for(var i = 0; i < treatmentsMap[key].recommendations.length; i++){
              treatmentsMap[key].recommendations[i] = recommendationsMap[treatmentsMap[key].recommendations[i]];
            }
          }
        }
        for(var i = 0; i < patientProfilesJSON.length; i++){
          patientProfilesJSON[i].userAccount = userAccountsMap[patientProfilesJSON[i].userAccount];
          for(var j = 0; j < patientProfilesJSON[i].treatments.length; j++){
            patientProfilesJSON[i].treatments[j] = treatmentsMap[patientProfilesJSON[i].treatments[j]];
          }
        }
        console.log('patientProfilesJSON:');
        console.log(patientProfilesJSON);
        return patientProfilesJSON;
      });
    }
});