import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    router: service(),
    beforeModel(){
        if(this.get('oudaAuth').get('isAuthenticated')){
            this.get('router').transitionTo('application');
        }
    },
    model() {
       return this.store.findAll('user-account');
    }
});