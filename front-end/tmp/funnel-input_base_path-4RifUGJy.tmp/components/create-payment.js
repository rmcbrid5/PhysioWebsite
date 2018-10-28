import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject(),
  DS: inject('store'),
  ajax: inject(),
  isProcessingStripe: false,
  actions:{
    processPayment: function(){
      var newPost = this.get('DS').createRecord('payment', {
      dayTimeStamp: new Date(),
      amount: 150,
      note: this.get('notes'),
      patientProfile: this.get('oudaAuth').getPerson()
    });
    newPost.save().then(()=> {
      return true;
    });
    return true;
    },
    processPayment1: function(){
      var newPost = this.get('DS').createRecord('payment', {
        dayTimeStamp: new Date(),
        amount: 350,
        note: this.get('notes1'),
        patientProfile: this.get('oudaAuth').getPerson()
      });
      newPost.save().then(()=> {
        return true;
      });
      return true;
    },
    processPayment2: function(){
      var newPost = this.get('DS').createRecord('payment', {
        dayTimeStamp: new Date(),
        amount: 550,
        note: this.get('notes2'),
        patientProfile: this.get('oudaAuth').getPerson()
      });
      newPost.save().then(()=> {
        return true;
      });
      return true;
    },
    processPayment3: function(){
      var newPost = this.get('DS').createRecord('payment', {
        dayTimeStamp: new Date(),
        amount: 75,
        note: this.get('notes3'),
        patientProfile: this.get('oudaAuth').getPerson()
      });
      newPost.save().then(()=> {
        return true;
      });
      return true;
    }

  },
  
});