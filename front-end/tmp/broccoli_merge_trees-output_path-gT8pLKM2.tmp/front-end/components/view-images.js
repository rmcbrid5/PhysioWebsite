import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  store: inject(),
  DS: inject('store'),
  imageModel: computed(function(){
    var self = this;
    var myStore = this.get('store');
    var authentication = this.get('oudaAuth');
    var patientID = this.get('ID');
    var imagesJSON = [];
    var imagesMap = []; // image id's -> images
    return myStore.findAll('image', {reload: true})
    .then(function(images){
      images.forEach(function(image){
        if(image.get('patientProfile') === patientID){
          var imageJSON = JSON.parse(JSON.stringify(image));
          imageJSON.id = image.id;
          imagesMap[imageJSON.id] = imageJSON;
        }
      });
      for(var key in imagesMap){
        if(imagesMap.hasOwnProperty(key)){
          imagesJSON.push(imagesMap[key]);
        }
      }
      return imagesJSON;
    });
  }),
  actions:{
    openModal: function () {
      this.set('imageModel', []);

      var self = this;
      var myStore = this.get('store');
      var authentication = this.get('oudaAuth');

      var patientID = this.get('ID');
      var imagesJSON = [];
      var imagesMap = []; // image id's -> images

      myStore.findAll('image', {reload: true})
      .then(function(images){
        images.forEach(function(image){
          if(image.get('patientProfile') === patientID){
            var imageJSON = JSON.parse(JSON.stringify(image));
            imageJSON.id = image.id;
            imagesMap[imageJSON.id] = imageJSON;
          }
        });
        for(var key in imagesMap){
          if(imagesMap.hasOwnProperty(key)){
            imagesJSON.push(imagesMap[key]);
          }
        }
        self.set('imageModel', imagesJSON);
        self.notifyPropertyChange('imageModel');
      });

      $('.ui.viewImages.modal').modal({
        closable: false,
        transition: "fade",
        onApprove: () => {
          return true;
        }
      }).modal('show');
    }
  },
  didInsertElement: function() {
    /* Init the table and fire off a call to get the hidden nodes. */
    $(document).ready(function() {
      var table = $('#example').DataTable();
    } );
  }
});