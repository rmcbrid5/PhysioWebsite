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
    model(){
        var self = this;
        var myStore = this.get('store');

        var injuryFormsJSON = [];
        var formMap = [];
        return myStore.findAll('injuryForm', {reload: true})
        .then(function(injuryForms){
            injuryForms.forEach(function(injuryForm){
                var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                injuryFormJSON.id = injuryForm.id;
                injuryFormsJSON.push(injuryFormJSON);
            });
            return myStore.findAll('form', {reload: true});
        }).then(function(forms){
            forms.forEach(function(form){
                var formJSON = JSON.parse(JSON.stringify(form));
                formJSON.id = form.id;
                formMap[form.id] = formJSON;
            });
            for(var i = 0; i < injuryFormsJSON.length; i++){
                injuryFormsJSON[i].form = formMap[injuryFormsJSON[i].form];
            }
            return injuryFormsJSON;
        });
    }
});
