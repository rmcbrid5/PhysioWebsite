import Component from '@ember/component';

export default Component.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    postsData: null,
    title: Ember.computed.oneWay('postsData.title'),
    body: Ember.computed.oneWay('postsData.body'),
    modalName: Ember.computed(function(){
        return 'Modify-Posts' + this.get('ID');
    }),
    actions:{
        openModal: function () {
            this.set('email', null);
            this.set('encryptedAuth', null);
            Ember.$('.ui.authenticateUser.modal').modal({
                closable: false,
                transition: 'fade',
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    // fetch('http://localhost:8082/selfStartUsers')
                    // .then(function(response){
                    //     return response.json();
                    // })
                    // .then(function(myJson){
                    //     var found = false;
                    //     var selfStartUser;
                    //     var email = this.get('email');
                    //     for(var i = 0; i < myJson.selfStartUser.length; i++){
                    //         if(userAccount[i].email === email){
                    //             found = true;
                    //             selfStartUser = myJson.selfStartUser[i];
                    //             break;
                    //         }
                    //     }
                    //     if(found){

                    //     }
                    //     else{

                    //     }
                    // });
                    var email = this.get('email');
                    var encryptedAuth = this.get('encryptedAuth');
                    var found = false;
                    var DS = this.get('DS');
                    this.get('store').findAll('self-start-user').then(function(selfStartUsers){
                        var theSelfStartUser;
                        selfStartUsers.forEach(function(selfStartUser){
                            var selfStartUserJSON = JSON.parse(JSON.stringify(selfStartUser));
                            if(selfStartUserJSON.email === email){
                                found = true;
                                theSelfStartUser = selfStartUserJSON;
                            }
                        });
                        if(found){
                            DS.find('user-account', theSelfStartUser.userAccount).then((userAccount) => {
                                userAccount.set('encryptedAuth', encryptedAuth);
                                userAccount.save().then(() => {
                                    DS.find('user-account', theSelfStartUser.userAccount).then((updatedUserAccount) => {
                                        if(updatedUserAccount.get('encryptedAuth') == ''){
                                            alert('User authenticated.');
                                        }
                                        else{
                                            alert('authentication failed, check email for new authentication code');
                                        }
                                    });
                                    return true;
                                })
                            });
                        }
                        else{
                            alert("Invalid email");
                        }
                    });
                }
            })
            .modal('show');
        }
    }
});