import Component from '@ember/component';
import fileObject from "../utils/file-object";
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  store: inject(),
  DS: inject('store'),
  model: null,
  flag: null,
  accept: 'audio/*,video/*,image/*',
  multiple: true,
  queue: [],
  savingInProgress: false,

  labelArray: [
    'height: 6.25em',
    'line-height: 5.25em',
    'text-align: center',
  ],

  inputStyle: computed(function () {
    let style_array = [
      'opacity: 0',
      'width:100% !important',
      'overflow:hidden',
      'position:relative',
      'left:-100%',
      'display:block',
    ];
    return htmlSafe(style_array.join(';'));
  }),

  labelStyle: computed('labelArray', function () {
    return htmlSafe(this.get('labelArray').join(';'));
  }),


  dragLeave: function (event) {
    event.preventDefault();
    this.set('labelArray', [
      'height: 6.25em',
      'line-height: 5.25em',
      'text-align: center',
    ]);
    return this.set('dragClass', 'deactivated');
  },

  dragOver: function () {
    this.set('labelArray', [
      'height: 6.25em',
      'line-height: 5.25em',
      'text-align: center',
      'background: green',
    ]);
  },

  drop: function () {
    this.set('labelArray', [
      'height: 6.25em',
      'line-height: 5.25em',
      'text-align: center',
    ]);
  },

  actions: {
    selectFile: function (data) {
      if (!isEmpty(data.target.files)) {
        for (let i = data.target.files.length - 1; i >= 0; i--) {
          let file = fileObject.create({
            fileToUpload: data.target.files[i],
            maximumFileSize: this.get('maximumFileSize')
          });
          this.get('queue').pushObject(file);
        }
      }
    }
    ,
    deleteFile: function (file) {
      this.get('queue').removeObject(file);
      if (isEmpty(this.get('queue'))) {
        this.set('flag', false);
      }
    }
    ,

    deleteAllFiles: function () {
      this.get('queue').clear();
      this.set('flag', false);
    }
    ,

    saveFile: function (file) {
      var newFile = this.get('DS').createRecord('image', {
        name: file.name,
        size: file.size,
        type: file.type,
        rawSize: file.rawSize,
        imageData: file.base64Image,
        patientProfile: this.get('oudaAuth').getPerson()
      });
      newFile.save().then(() => {
        this.get('queue').removeObject(file);

        if (Ember.isEmpty(this.get('queue'))) {
          this.set('flag', false);
        }
      });

    }
    ,

    saveAllFiles: function () {
      this.set('savingInProgress', true);
      let counter = 0;
      this.get('queue').forEach(file => {
        if (file.isDisplayableImage) {
          var newFile = this.get('DS').createRecord('image', {
            name: file.name,
            size: file.size,
            type: file.type,
            rawSize: file.rawSize,
            imageData: file.base64Image,
            patientProfile: this.get('oudaAuth').getPerson()
          });
          newFile.save().then(() => {
            counter++;
            if (this.get('queue').length == counter) {
              this.get('queue').clear();
              this.set('flag', false);
              this.set('savingInProgress', false);
            }
          });
        } else{
          counter++;
        }
      });






    }
    ,
    done: function () {
      this.get('queue').clear();
      this.set('flag', false);
    }
  }
});