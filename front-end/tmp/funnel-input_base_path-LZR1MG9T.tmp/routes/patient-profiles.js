import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    router: service(),
    beforeModel(){
        if(this.get('oudaAuth').getRole() !== 'ph'){
            this.get('router').transitionTo('home');
        }
    },
    model(){
        return this.get('store').findAll('patient-profile', {reload: true});
    }
});