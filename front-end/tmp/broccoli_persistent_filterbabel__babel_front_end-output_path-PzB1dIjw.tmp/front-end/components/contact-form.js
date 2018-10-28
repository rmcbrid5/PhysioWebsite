define("front-end/components/contact-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    actions: {
      sendMessage: function sendMessage() {
        var name = this.get("name");
        var email = this.get("email");
        var phone = this.get("phone");
        var message = this.get("message");
        if (name == undefined || email == undefined || phone == undefined || message == undefined) {
          alert("Please fill out all fields");
        } else {
          fetch('http://localhost:8082/mail/' + name + '/' + email + '/' + phone + '/' + message).then(function (response) {
            alert('Message sent!');
          });
        }
      }
    }
  });
});