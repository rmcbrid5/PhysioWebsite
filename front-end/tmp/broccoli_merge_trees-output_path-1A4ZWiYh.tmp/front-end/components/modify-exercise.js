define('front-end/components/modify-exercise', ['exports', 'front-end/utils/file-object'], function (exports, _fileObject) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Exercise' + this.get('ID');
        }),
        actionStepModel: Ember.computed(function () {
            var objModel = [];
            for (var i = 0; i < this.get('actionSteps').length; i++) {
                var obj = { value: this.get('actionSteps')[i] };
                objModel.push(obj);
            }
            return objModel;
        }),
        objectiveModel: Ember.computed(function () {
            var objModel = [];
            for (var i = 0; i < this.get('objectives').length; i++) {
                var obj = { value: this.get('objectives')[i] };
                objModel.push(obj);
            }
            return objModel;
        }),
        flag: null,
        accept: 'audio/*,video/*,image/*',
        multiple: false,
        queue: [],
        savingInProgress: false,

        labelArray: ['height: 6.25em', 'line-height: 5.25em', 'text-align: center'],

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

                var obj = this;
                var DS = this.get('DS');

                DS.findRecord('exercise', this.get('ID'), { reload: true }).then(function (exercise) {
                    var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                    return DS.findRecord('image', exerciseJSON.image, { reload: true });
                }).then(function (theImage) {
                    var imageJSON = JSON.parse(JSON.stringify(theImage));
                    imageJSON.id = theImage.id;
                    obj.set('queue', [{
                        name: imageJSON.name,
                        size: imageJSON.size,
                        type: imageJSON.type,
                        rawSize: imageJSON.rawSize,
                        base64Image: imageJSON.imageData,
                        exercise: obj.get('ID'),
                        isDisplayableImage: true,
                        patientProfile: null
                    }]);
                });

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var obj = _this;
                        var DS = _this.get('DS');
                        if (!_this.get('frequency') || isNaN(_this.get('frequency'))) {
                            alert('Frequency must be a number.');
                            return false;
                        }
                        if (!_this.get('duration') || isNaN(_this.get('duration'))) {
                            alert('Duration must be a number.');
                            return false;
                        }
                        if (!_this.get('name')) {
                            alert('Name must be non-empty.');
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
                        for (var i = 0; i < _this.get('actionStepModel').length; i++) {
                            actionSteps.push(_this.get('actionStepModel')[i].value);
                        }
                        DS.findRecord('exercise', _this.get('ID'), { reload: true }).then(function (exercise) {
                            exercise.set('name', obj.get('name'));
                            exercise.set('description', obj.get('description'));
                            exercise.set('objectives', objectives);
                            exercise.set('actionSteps', actionSteps);
                            exercise.set('frequency', obj.get('frequency'));
                            exercise.set('duration', obj.get('duration'));
                            return exercise.save({ reload: true });
                        }).then(function () {
                            var newImage = DS.createRecord('image', {
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                rawSize: file.rawSize,
                                imageData: file.base64Image,
                                patientProfile: null,
                                exercise: obj.get('ID')
                            });

                            return newImage.save({ reload: true });
                        }).then(function () {
                            alert('Exercise Updated.');
                        }).catch(function (err) {
                            console.log(err);
                        });
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
        },
        didInsertElement: function didInsertElement() {
            /* Init the table and fire off a call to get the hidden nodes. */
            Ember.$(document).ready(function () {
                var table = Ember.$('#example').DataTable();
            });
        }
    });
});