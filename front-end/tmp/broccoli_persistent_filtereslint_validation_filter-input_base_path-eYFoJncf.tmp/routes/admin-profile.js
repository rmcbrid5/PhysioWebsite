import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    store: service(),
    beforeModel(){
        if(this.get('oudaAuth').getRole() !== 'ad'){
            this.transitionTo('home');
        }
    },
    model(){
        var self = this;
        var adminJSON;
        return this.get('store').findRecord('administrator', this.get('oudaAuth').getPerson(), {reload: true})
        .then(function(admin){
            adminJSON = JSON.parse(JSON.stringify(admin));
            adminJSON.id = admin.id;
            adminJSON.dateHired = new Date(adminJSON.dateHired);
            return self.get('store').findRecord('userAccount', adminJSON.userAccount, {reload: true});
        }).then(function(userAccount){
            var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
            userAccountJSON.id = userAccount.id;
            adminJSON.userAccount = userAccountJSON;
            return adminJSON;
        });
    }
});
