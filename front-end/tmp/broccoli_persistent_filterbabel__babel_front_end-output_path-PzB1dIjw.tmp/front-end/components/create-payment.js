define('front-end/components/create-payment', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    ajax: Ember.inject.service(),
    isProcessingStripe: false,
    actions: {
      processPayment: function processPayment() {
        var newPost = this.get('DS').createRecord('payment', {
          dayTimeStamp: new Date(),
          amount: 150,
          note: this.get('notes'),
          patientProfile: this.get('oudaAuth').getPerson()
        });
        newPost.save().then(function () {
          return true;
        });
        return true;
      },
      processPayment1: function processPayment1() {
        var newPost = this.get('DS').createRecord('payment', {
          dayTimeStamp: new Date(),
          amount: 350,
          note: this.get('notes1'),
          patientProfile: this.get('oudaAuth').getPerson()
        });
        newPost.save().then(function () {
          return true;
        });
        return true;
      },
      processPayment2: function processPayment2() {
        var newPost = this.get('DS').createRecord('payment', {
          dayTimeStamp: new Date(),
          amount: 550,
          note: this.get('notes2'),
          patientProfile: this.get('oudaAuth').getPerson()
        });
        newPost.save().then(function () {
          return true;
        });
        return true;
      },
      processPayment3: function processPayment3() {
        var newPost = this.get('DS').createRecord('payment', {
          dayTimeStamp: new Date(),
          amount: 75,
          note: this.get('notes3'),
          patientProfile: this.get('oudaAuth').getPerson()
        });
        newPost.save().then(function () {
          return true;
        });
        return true;
      }

    }

  });
});