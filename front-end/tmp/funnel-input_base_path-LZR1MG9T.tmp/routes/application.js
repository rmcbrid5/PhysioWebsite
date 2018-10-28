import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    router: service(),
    beforeModel(){
        var authentication = this.get('oudaAuth');
        authentication.set('isLoginRequested', false);
        var self = this;

        if(!localStorage.getItem('sas-session-id')){
            this.get('router').transitionTo('home');
            return;
        }
        authentication.fetch()
        .then(function(res){
            self.get('router').transitionTo('home');
        }).catch(function(err){
            self.get('router').transitionTo('home');
        });
    }
});
