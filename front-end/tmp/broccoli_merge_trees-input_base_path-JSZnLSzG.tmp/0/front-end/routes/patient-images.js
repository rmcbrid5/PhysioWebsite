
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  router: service(),
  beforeModel(){
    if(this.get('oudaAuth').getRole() !== 'ph'){
      this.transitionTo('home');
    }
  },
  model() {
    var authentication = this.get('oudaAuth');
    var myStore = this.get('store');
    var patientProfilesJSON = [];
    return myStore.findAll('patient-profile', {reload: true});
  }
});