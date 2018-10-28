define('front-end/routes/my-images', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'pa') {
        this.get('router').transitionTo('home');
      }
    },
    model: function model() {
      var self = this;
      var myStore = this.get('store');
      var authentication = this.get('oudaAuth');

      var imageJSON = [];

      var imagesMap = []; // image id's -> images

      return myStore.findAll('image', { reload: true }).then(function (images) {
        images.forEach(function (image) {
          if (image.get('patientProfile') === authentication.getPerson()) {
            var imageJSON = JSON.parse(JSON.stringify(image));
            imageJSON.id = image.id;
            imagesMap[imageJSON.id] = imageJSON;
          }
        });
        for (var key in imagesMap) {
          if (imagesMap.hasOwnProperty(key)) {
            imageJSON.push(imagesMap[key]);
          }
        }
        return imageJSON;
      });
    },

    actions: {
      deleteImage: function deleteImage(ID) {
        this.get('DS').findRecord('image', ID, { reload: true }).then(function (post) {
          post.destroyRecord().then(function () {
            alert("Image has been deleted!");
            return true;
          });
        });
      }
    }
  });
});