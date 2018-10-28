define('front-end/components/view-images', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    imageModel: Ember.computed(function () {
      var self = this;
      var myStore = this.get('store');
      var authentication = this.get('oudaAuth');
      var patientID = this.get('ID');
      var imagesJSON = [];
      var imagesMap = []; // image id's -> images
      return myStore.findAll('image', { reload: true }).then(function (images) {
        images.forEach(function (image) {
          if (image.get('patientProfile') === patientID) {
            var imageJSON = JSON.parse(JSON.stringify(image));
            imageJSON.id = image.id;
            imagesMap[imageJSON.id] = imageJSON;
          }
        });
        for (var key in imagesMap) {
          if (imagesMap.hasOwnProperty(key)) {
            imagesJSON.push(imagesMap[key]);
          }
        }
        return imagesJSON;
      });
    }),
    actions: {
      openModal: function openModal() {
        this.set('imageModel', []);

        var self = this;
        var myStore = this.get('store');
        var authentication = this.get('oudaAuth');

        var patientID = this.get('ID');
        var imagesJSON = [];
        var imagesMap = []; // image id's -> images

        myStore.findAll('image', { reload: true }).then(function (images) {
          images.forEach(function (image) {
            if (image.get('patientProfile') === patientID) {
              var imageJSON = JSON.parse(JSON.stringify(image));
              imageJSON.id = image.id;
              imagesMap[imageJSON.id] = imageJSON;
            }
          });
          for (var key in imagesMap) {
            if (imagesMap.hasOwnProperty(key)) {
              imagesJSON.push(imagesMap[key]);
            }
          }
          self.set('imageModel', imagesJSON);
          self.notifyPropertyChange('imageModel');
        });

        Ember.$('.ui.viewImages.modal').modal({
          closable: false,
          transition: "fade",
          onApprove: function onApprove() {
            return true;
          }
        }).modal('show');
      }
    },
    didInsertElement: function didInsertElement() {
      /* Init the table and fire off a call to get the hidden nodes. */
      Ember.$(document).ready(function () {
        var table = Ember.$('#example').DataTable();
      });
    }
  });
});