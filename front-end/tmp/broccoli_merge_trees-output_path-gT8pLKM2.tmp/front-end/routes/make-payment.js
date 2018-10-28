import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    router: service(),
    beforeModel(){
        if(this.get('oudaAuth').getRole() !== 'pa'){
            this.get('router').transitionTo('home');
        }
    }
});
