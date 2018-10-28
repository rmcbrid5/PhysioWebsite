import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    router: service(),
    beforeModel(){
        if(this.get('oudaAuth').getRole() !== 'ph'){
            this.get('router').transitionTo('home');
        }
    },
    model() {
        var authentication = this.get('oudaAuth');
        var rehabilitationPlansJSON = [];
        return this.store.findAll('rehabilitation-plan')
        .then(function(rehabilitationPlans){
            rehabilitationPlans.forEach(function(rehabilitationPlan){
                var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                rehabilitationPlanJSON.id = rehabilitationPlan.id;
                if(rehabilitationPlanJSON.physiotherapist === authentication.getPerson()){
                    rehabilitationPlansJSON.push(rehabilitationPlanJSON);
                }
            });
            return rehabilitationPlansJSON;
        });
    }
});