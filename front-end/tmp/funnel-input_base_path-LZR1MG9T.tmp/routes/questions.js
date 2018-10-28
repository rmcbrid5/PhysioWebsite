import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  router: service(),
  beforeModel(){
    if(this.get('oudaAuth').getRole() !== 'ad'){
      this.get('router').transitionTo('home');
    }
  },
    model() {
        var questionPairs = [];
        var DS = this.store;
        var questionsJSON = [];
        var self = this;
        var myStore = this.get('store');
        return DS.findAll('question')
        .then(function(questions){
            questions.forEach(function(question){
                var questionJSON = JSON.parse(JSON.stringify(question));
                questionJSON.id = question.id;
                questionsJSON.push(questionJSON);
            });
            return myStore.findAll('question-type');
          }).then(function(questiontype){
              questiontype.forEach(function(questiontype){
                //console.log(questiontype)
                for (var i = 0; i <questionsJSON.length; i++){
                 if (questionsJSON[i].questionType === questiontype.id){
                    questionsJSON[i].questionType = questiontype._internalModel._data.name;
                  }
                }
              });
              return questionsJSON;
        })
  }
});
