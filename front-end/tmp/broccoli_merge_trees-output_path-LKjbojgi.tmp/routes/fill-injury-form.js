import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Route.extend({
    store: inject(),
    model() {
        var injuryFormsJSON = [];
        var self = this;
        var myStore = this.get('store');

        return myStore.findAll('injury-form')
        .then(function(injuryForms){
            injuryForms.forEach(function(injuryForm){
                var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                injuryFormJSON.id = injuryForm.id;
                injuryFormsJSON.push(injuryFormJSON);
            });
            return myStore.findAll('form', {reload: true});
        }).then(function(forms){
            forms.forEach(function(form){
                for (var i = 0; i < injuryFormsJSON.length; i++){
                    if (injuryFormsJSON[i].form === form.id){
                        var formJSON = JSON.parse(JSON.stringify(form));
                        formJSON.id = form.id;
                        injuryFormsJSON[i].form = formJSON;
                    }
                }
            });
            return injuryFormsJSON;
        })
    }
});