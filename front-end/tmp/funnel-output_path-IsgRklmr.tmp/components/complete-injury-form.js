import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import $ from 'jquery';

export default Component.extend({
    store: inject(),
    postsData: null,
    title: oneWay('postsData.title'),
    body: oneWay('postsData.body'),
    modalName: computed(function(){
        return 'Injury-Form' + this.get('ID');
    }),
    actions:  {
        clicky (value) {
            this.set("someAttr", value)
        },
        openModal: function () {
          var self = this;
          var myStore = this.get('store');
          this.set('email', '');

          var questionsListsMap = [];
          var questionsMap = [];
          for(var i = 0; i < this.get('injuryForm').form.questionsLists.length; i++){
            questionsListsMap[this.get('injuryForm').form.questionsLists[i]] = 1;
          }
          var uniqueCount = 0;
          myStore.findAll('questions-list', {reload: true})
          .then(function(questionsLists){
            questionsLists.forEach(function(questionsList){
              if(questionsListsMap[questionsList.id]){
                var questionsListJSON = JSON.parse(JSON.stringify(questionsList));
                questionsListJSON.id = questionsList.id;
                questionsListJSON.unique = 'Answer ' + uniqueCount.toString();
                uniqueCount++;
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
              }
            });
            for(var key in questionsMap){
              if(questionsMap.hasOwnProperty(key)){
                for(var i = 0; i < questionsMap[key].questionsLists.length; i++){
                  questionsMap[key].questionsLists[i] = questionsListsMap[questionsMap[key].questionsLists[i]];
                }
              }
            }
            for(var key in questionsListsMap){
              if(questionsListsMap.hasOwnProperty(key)){
                questionsListsMap[key].question = questionsMap[questionsListsMap[key].question];
                questionsListsMap[key].form = self.get('injuryForm').form
              }
            }
            for(var i = 0; i < self.get('injuryForm').form.questionsLists.length; i++){
              self.get('injuryForm').form.questionsLists[i] = questionsListsMap[self.get('injuryForm').form.questionsLists[i]];
            }
            self.notifyPropertyChange('injuryForm');
          });

          Ember.$('.ui.'+this.get('modalName')+'.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                  if(!this.get('email')){
                    alert('Please enter your email.');
                    return false;
                  }
                  
                  var newCompletedInjuryForm = myStore.createRecord('completed-injury-form', {
                    email: self.get('email'),
                    date: new Date(),
                    injuryForm: self.get('injuryForm').id
                  });
                  newCompletedInjuryForm.save({reload: true})
                  .then(function(){
                    function addInjuryResults(index){
                      if(index !== self.get('injuryForm').form.questionsLists.length){
                        var newInjuryResult = myStore.createRecord('injury-result', {
                          questionText: self.get('injuryForm').form.questionsLists[index].question.questionText,
                          answer: self.get('injuryForm').form.questionsLists[index].unique,
                          completedInjuryForm: newCompletedInjuryForm.id
                        });
                        return newInjuryResult.save({reload: true})
                        .then(function(){
                          return addInjuryResults(index + 1);
                        });
                      }
                      else{
                        alert('Injury Form Completed.');
                      }
                    }

                    addInjuryResults(0);
                  });
                }
            }).modal('show');
        },
        didInsertElement: function() {
          /* Init the table and fire off a call to get the hidden nodes. */
          $(document).ready(function() {
              var table = $('#example').DataTable();
            } );
          }
      }

});