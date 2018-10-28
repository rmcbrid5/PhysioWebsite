import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Route.extend({
  store: service(),
  DS : inject('store'),
  router: service(),
    beforeModel(){
      if(this.get('oudaAuth').getRole() !== 'pa'){
        this.get('router').transitionTo('home');
      }
    },
    model(){
        var self = this;
        var myStore = this.get('store');
        var authentication = this.get('oudaAuth');

        var imageJSON = [];

        var imagesMap = []; // image id's -> images

        return myStore.findAll('image', {reload: true})
        .then(function(images){
          images.forEach(function(image){
            if(image.get('patientProfile') === authentication.getPerson()){
              var imageJSON = JSON.parse(JSON.stringify(image));
              imageJSON.id = image.id;
              imagesMap[imageJSON.id] = imageJSON;
            }
          });
          for(var key in imagesMap){
            if(imagesMap.hasOwnProperty(key)){
              imageJSON.push(imagesMap[key]);
            }
          }
          return imageJSON;
        });
    },
  actions:{
  deleteImage: function(ID) {
        this.get('DS').findRecord('image', ID, {reload: true}).then((post) => {
          post.destroyRecord().then(() => {
            alert("Image has been deleted!");
            return true;
          });
        })
      }
  }
});