import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  DS: inject('store'),
  ImageIsAdding: false,

  model: computed(function(){
    return this.get('DS').findAll ('image');
  }),

  actions: {
    deleteImage: function (file) {
      file.destroyRecord();
    },
    addNewImage: function () {
      this.set('ImageIsAdding', true);
    }
  }
});