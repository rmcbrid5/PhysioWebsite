import Component from '@ember/component';
import fileObject from "../utils/file-object";
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default Component.extend({
    beforeModel(){
        // this.set('queue', []);
        // this.set('labelArray', ['height: 6.25em', 'line-height: 5.25em', 'text-align: center']);
    },
    queue: [],
    labelArray: ['height: 6.25em', 'line-height: 5.25em', 'text-align: center'],
    store: inject(),
    DS: inject('store'),
    physiotherapistModel: computed(function(){
        return this.get('store').findAll('physiotherapist');
    }),
    flag: null,
    accept: 'audio/*,video/*,image/*',
    multiple: false,
    // queue: [],
    savingInProgress: false,

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
    actions:{
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
        },
        deleteFile: function (file) {
            this.get('queue').removeObject(file);
                if (isEmpty(this.get('queue'))) {
                this.set('flag', false);
            }
        },
        addActionStep: function(){
            var model = this.get('actionStepModel');
            var obj = {value: 'actionStep' + this.get('actionStepModel').length.toString()};
            model.push(obj);
            this.set('actionStepModel', model);
            this.notifyPropertyChange('actionStepModel');
        },
        addObjective: function(){
            var model = this.get('objectiveModel');
            var obj = {value: 'objective' + this.get('objectiveModel').length.toString()};
            model.push(obj);
            this.set('objectiveModel', model);
            this.notifyPropertyChange('objectiveModel');
        },
        openModal: function () {
            this.set('name', null);
            this.set('description', null);
            this.set('actionStepModel', []);
            this.set('objectiveModel', []);
            this.set('frequency', null);
            this.set('duration', null);
            $('.ui.newExercise.modal').modal({
                closable: false,
                transition: "fade",
                onDeny: () => {
                    return true;
                },
                onApprove: () => {
                    var DS = this.get('DS');
                    if(!this.get('name')){
                        alert('Name must be non-empty.');
                        return false;
                    }
                    if(!this.get('frequency') || isNaN(this.get('frequency'))){
                        alert('Frequency must be a number.');
                        return false;
                    }
                    if(!this.get('duration') || isNaN(this.get('duration'))){
                        alert('Duration must be a number.');
                        return false;
                    }
                    if(this.get('queue').length != 1){
                        alert('Must have exactly 1 image selected.');
                        return false;
                    }
                    var file = this.get('queue')[0];
                    var objectives = [];
                    for(var i = 0; i < this.get('objectiveModel').length; i++){
                        objectives.push(this.get('objectiveModel')[i].value);
                    }
                    var actionSteps = [];
                    for(var j = 0; j < this.get('actionStepModel').length; j++){
                        actionSteps.push(this.get('actionStepModel')[j].value);
                    }
                    var newExercise = DS.createRecord('exercise', {
                        name: this.get('name'),
                        description: this.get('description'),
                        objectives: objectives,
                        actionSteps: actionSteps,
                        frequency: this.get('frequency'),
                        duration: this.get('duration')
                    });
                    newExercise.save({reload: true})
                    .then(function(){
                        var newImage = DS.createRecord('image', {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            rawSize: file.rawSize,
                            imageData: file.base64Image,
                            exercise: newExercise.id
                        });
                        return newImage.save({reload: true});
                    }).then(function(){
                        alert('Exercise created.');
                        return true;
                    });
                    return true;
                }
            })
            .modal('show');
        },
        removeActionStep: function(actionStep){
            var objModel = this.get('actionStepModel');
            var index = objModel.indexOf(actionStep);
            objModel.splice(index, 1);
            this.set('actionStepModel', objModel);
            this.notifyPropertyChange('actionStepModel');
        },
        removeObjective: function(objective){
            var objModel = this.get('objectiveModel');
            var index = objModel.indexOf(objective);
            objModel.splice(index, 1);
            this.set('objectiveModel', objModel);
            this.notifyPropertyChange('objectiveModel');
        },
        selectDate: function(date){
            this.set('targetDate', date);
        }
    }
});