import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    store: service(),
    model(){
        var self = this;
        var myStore = this.get('store');

        var completedInjuryFormsJSON = [];
        var injuryResultsMap = [];
        var injuryFormsMap = [];

        return myStore.findAll('completed-injury-form', {reload: true})
        .then(function(completedInjuryForms){
            completedInjuryForms.forEach(function(completedInjuryForm){
                var completedInjuryFormJSON = JSON.parse(JSON.stringify(completedInjuryForm));
                completedInjuryFormJSON.id = completedInjuryForm.id;
                completedInjuryFormsJSON.push(completedInjuryFormJSON);
                for(var i = 0; i < completedInjuryFormJSON.injuryResults.length; i++){
                    injuryResultsMap[completedInjuryFormJSON.injuryResults[i]] = 1;
                }
                injuryFormsMap[completedInjuryFormJSON.injuryForm] = 1;
            });
            return myStore.findAll('injuryResult', {reload: true});
        }).then(function(injuryResults){
            injuryResults.forEach(function(injuryResult){
                if(injuryResultsMap[injuryResult.id]){
                    var injuryResultJSON = JSON.parse(JSON.stringify(injuryResult));
                    injuryResultJSON.id = injuryResult.id;
                    injuryResultsMap[injuryResult.id] = injuryResultJSON;
                }
            });
            for(var i = 0; i < completedInjuryFormsJSON.length; i++){
                for(var j = 0; j < completedInjuryFormsJSON[i].injuryResults.length; j++){
                    completedInjuryFormsJSON[i].injuryResults[j] = injuryResultsMap[completedInjuryFormsJSON[i].injuryResults[j]];
                }
            }
            return myStore.findAll('injury-form', {reload: true});
        }).then(function(injuryForms){
            injuryForms.forEach(function(injuryForm){
              if(injuryFormsMap[injuryForm.id]){
                var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                injuryFormJSON.id = injuryForm.id;
                injuryFormsMap[injuryForm.id] = injuryFormJSON;
              }
            });
            for(var i = 0; i < completedInjuryFormsJSON.length; i++){
              completedInjuryFormsJSON[i].injuryForm = injuryFormsMap[completedInjuryFormsJSON[i].injuryForm];
            }
            return completedInjuryFormsJSON;
        });
    },
    actions: {
        removeCompletedInjuryForm(id){
            this.get('store').find('completed-injury-form', id, {reload: true})
            .then(function(completedInjuryForm){
                return completedInjuryForm.destroyRecord();
            }).then(function(){
                alert('Completed Injury Form Deleted.');
            });
        }
    }
});