import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    store: inject(),
    actions: {
        logout: function(){
            var authentication = this.get('oudaAuth');
            if(authentication.userCList){
                var identity = localStorage.getItem('sas-session-id');
                var name = authentication.decrypt(identity);
                authentication.close(name);
            }
        }
    }
});
