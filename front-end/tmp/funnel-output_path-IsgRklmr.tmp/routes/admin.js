import Route from '@ember/routing/route';

export default Route.extend({
  model() {
      var DS = this.store;
      var adminJSON = [];
      var obj = this;
      var userCount = 0;
      var physioCount = 0;
      return DS.findAll('patientProfile')
      .then(function(patients){
              patients.forEach(function(patients){
              userCount++;
          });
          adminJSON.push(userCount);
          return obj.store.findAll('physiotherapist');
       }).then(function(physio){
             physio.forEach(function(physio){
               physioCount++;
             });
           adminJSON.push(physioCount);
        //     return obj.store.findAll('assessment-test');
        //   }).then(function(assessmentTest){
        //     assessmentTest.forEach(function(assessmentTest){
        //       //console.log(at);
        //       //console.log(formsJSON);
        //       for (var i = 0; i <formsJSON.length; i++){
        //         for(var j = 0; j <formsJSON[i].assessmentTests.length; j++){
        //           if (formsJSON[i].assessmentTests[j] == assessmentTest.id){
        //             formsJSON[i].assessmentTests[j] = assessmentTest._internalModel._data.name;
        //               //console.log(formsJSON[i].assessmentTests[j]);
        //           }
        //         }
        //       }
        //     });
        //       return obj.store.findAll('question');
        //     }).then(function(question){
        //       question.forEach(function(question){
        //         console.log(question);
        //         console.log(formsJSON);
        //         for (var i = 0; i <formsJSON.length; i++){
        //           for(var j = 0; j <formsJSON[i].questionsLists.length; j++){
        //             if (formsJSON[i].questionsLists[j] == question.id){
        //                formsJSON[i].questionsLists[j] = question._internalModel._data.questionText;
        //
        //               //doesnt get here
        //                console.log(formsJSON[i].questionsLists[j]);
        //              }
        //           }
        //         }
        //       });
              console.log(adminJSON);
              return adminJSON;
          })
        },
        model2: function() {
          return this.store.find('to-do-list');
}
});