import Component from '@ember/component';

export default Component.extend({
  actions:{
    sendMessage: function(){
      var name = this.get("name");
      var email = this.get("email");
      var phone = this.get("phone");
      var message = this.get("message");
      if(name==undefined||email==undefined||phone==undefined||message==undefined){
        alert("Please fill out all fields");
      }else{
        fetch('http://localhost:8082/mail/' + name + '/' + email + '/' + phone + '/' + message)
         .then(function(response){
           alert('Message sent!');
         });
      }
     
    }
  }
});