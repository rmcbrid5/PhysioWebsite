import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        var DS = this.store;
        var assessmentTestJSON = [];
        var obj = this;
        return DS.findAll('assessment-test')
        .then(function(at){
            at.forEach(function(at){
                var assessmentTestsJSON = JSON.parse(JSON.stringify(at));
                assessmentTestsJSON.id = at.id;
                assessmentTestJSON.push(assessmentTestsJSON);
            });
            return obj.store.findAll('form');
          }).then(function(form){
              form.forEach(function(form){
                for (var i = 0; i <assessmentTestJSON.length; i++){
                 if (assessmentTestJSON[i].form == form.id){
                    assessmentTestJSON[i].form = form._internalModel._data.name;

                  }
                }
              });
              //return obj.store.findAll('physiotherapist');
            // }).then(function(physiotherapist){
            //   physiotherapist.forEach(function(physiotherapist){
            //     for (var i = 0; i <assessmentTestJSON.length; i++){
            //
            //         if (assessmentTestJSON[i].physiotherapist == physiotherapist.id){
            //           assessmentTestJSON[i].physiotherapist_fname = physiotherapist._internalModel._data.givenName;
            //           assessmentTestJSON[i].physiotherapist_lname = physiotherapist._internalModel._data.familyName;
            //       }
            //     }
            //  });
                return assessmentTestJSON;
             })
          }
});
