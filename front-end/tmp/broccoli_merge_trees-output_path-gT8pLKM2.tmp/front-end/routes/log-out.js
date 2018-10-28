import Route from '@ember/routing/route';

export default Route.extend({
    beforeModel(){
        var authentication = this.get('oudaAuth');
        if(authentication.userCList){
            var identity = localStorage.getItem('sas-session-id');
            var name = authentication.decrypt(identity);
            authentication.close(name);
        }
    }
});
