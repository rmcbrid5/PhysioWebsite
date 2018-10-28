define('front-end/components/add-exercise', ['exports', 'front-end/utils/file-object'], function (exports, _fileObject) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        beforeModel: function beforeModel() {
            // this.set('queue', []);
            // this.set('labelArray', ['height: 6.25em', 'line-height: 5.25em', 'text-align: center']);
        },

        queue: [],
        labelArray: ['height: 6.25em', 'line-height: 5.25em', 'text-align: center'],
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        physiotherapistModel: Ember.computed(function () {
            return this.get('store').findAll('physiotherapist');
        }),
        flag: null,
        accept: 'audio/*,video/*,image/*',
        multiple: false,
        // queue: [],
        savingInProgress: false,

        inputStyle: Ember.computed(function () {
            var style_array = ['opacity: 0', 'width:100% !important', 'overflow:hidden', 'position:relative', 'left:-100%', 'display:block'];

            return Ember.String.htmlSafe(style_array.join(';'));
        }),

        labelStyle: Ember.computed('labelArray', function () {
            return Ember.String.htmlSafe(this.get('labelArray').join(';'));
        }),

        dragLeave: function dragLeave(event) {
            event.preventDefault();
            this.set('labelArray', ['height: 6.25em', 'line-height: 5.25em', 'text-align: center']);
            return this.set('dragClass', 'deactivated');
        },

        dragOver: function dragOver() {
            this.set('labelArray', ['height: 6.25em', 'line-height: 5.25em', 'text-align: center', 'background: green']);
        },

        drop: function drop() {
            this.set('labelArray', ['height: 6.25em', 'line-height: 5.25em', 'text-align: center']);
        },
        actions: {
            selectFile: function selectFile(data) {
                if (!Ember.isEmpty(data.target.files)) {
                    for (var i = data.target.files.length - 1; i >= 0; i--) {
                        var file = _fileObject.default.create({
                            fileToUpload: data.target.files[i],
                            maximumFileSize: this.get('maximumFileSize')
                        });
                        this.get('queue').pushObject(file);
                    }
                }
            },
            deleteFile: function deleteFile(file) {
                this.get('queue').removeObject(file);
                if (Ember.isEmpty(this.get('queue'))) {
                    this.set('flag', false);
                }
            },
            addActionStep: function addActionStep() {
                var model = this.get('actionStepModel');
                var obj = { value: 'actionStep' + this.get('actionStepModel').length.toString() };
                model.push(obj);
                this.set('actionStepModel', model);
                this.notifyPropertyChange('actionStepModel');
            },
            addObjective: function addObjective() {
                var model = this.get('objectiveModel');
                var obj = { value: 'objective' + this.get('objectiveModel').length.toString() };
                model.push(obj);
                this.set('objectiveModel', model);
                this.notifyPropertyChange('objectiveModel');
            },
            openModal: function openModal() {
                var _this = this;

                this.set('name', null);
                this.set('description', null);
                this.set('actionStepModel', []);
                this.set('objectiveModel', []);
                this.set('frequency', null);
                this.set('duration', null);
                Ember.$('.ui.newExercise.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var DS = _this.get('DS');
                        if (!_this.get('name')) {
                            alert('Name must be non-empty.');
                            return false;
                        }
                        if (!_this.get('frequency') || isNaN(_this.get('frequency'))) {
                            alert('Frequency must be a number.');
                            return false;
                        }
                        if (!_this.get('duration') || isNaN(_this.get('duration'))) {
                            alert('Duration must be a number.');
                            return false;
                        }
                        if (_this.get('queue').length != 1) {
                            alert('Must have exactly 1 image selected.');
                            return false;
                        }
                        var file = _this.get('queue')[0];
                        var objectives = [];
                        for (var i = 0; i < _this.get('objectiveModel').length; i++) {
                            objectives.push(_this.get('objectiveModel')[i].value);
                        }
                        var actionSteps = [];
                        for (var j = 0; j < _this.get('actionStepModel').length; j++) {
                            actionSteps.push(_this.get('actionStepModel')[j].value);
                        }
                        var newExercise = DS.createRecord('exercise', {
                            name: _this.get('name'),
                            description: _this.get('description'),
                            objectives: objectives,
                            actionSteps: actionSteps,
                            frequency: _this.get('frequency'),
                            duration: _this.get('duration')
                        });
                        newExercise.save({ reload: true }).then(function () {
                            var newImage = DS.createRecord('image', {
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                rawSize: file.rawSize,
                                imageData: file.base64Image,
                                exercise: newExercise.id
                            });
                            return newImage.save({ reload: true });
                        }).then(function () {
                            alert('Exercise created.');
                            return true;
                        });
                        return true;
                    }
                }).modal('show');
            },
            removeActionStep: function removeActionStep(actionStep) {
                var objModel = this.get('actionStepModel');
                var index = objModel.indexOf(actionStep);
                objModel.splice(index, 1);
                this.set('actionStepModel', objModel);
                this.notifyPropertyChange('actionStepModel');
            },
            removeObjective: function removeObjective(objective) {
                var objModel = this.get('objectiveModel');
                var index = objModel.indexOf(objective);
                objModel.splice(index, 1);
                this.set('objectiveModel', objModel);
                this.notifyPropertyChange('objectiveModel');
            },
            selectDate: function selectDate(date) {
                this.set('targetDate', date);
            }
        }
    });
});