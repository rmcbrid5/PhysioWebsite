define('front-end/routes/questions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ad') {
        this.get('router').transitionTo('home');
      }
    },
    model: function model() {
      var questionPairs = [];
      var DS = this.store;
      var questionsJSON = [];
      var self = this;
      var myStore = this.get('store');
      return DS.findAll('question').then(function (questions) {
        questions.forEach(function (question) {
          var questionJSON = JSON.parse(JSON.stringify(question));
          questionJSON.id = question.id;
          questionsJSON.push(questionJSON);
        });
        return myStore.findAll('question-type');
      }).then(function (questiontype) {
        questiontype.forEach(function (questiontype) {
          //console.log(questiontype)
          for (var i = 0; i < questionsJSON.length; i++) {
            if (questionsJSON[i].questionType === questiontype.id) {
              questionsJSON[i].questionType = questiontype._internalModel._data.name;
            }
          }
        });
        return questionsJSON;
      });
    }
  });
});