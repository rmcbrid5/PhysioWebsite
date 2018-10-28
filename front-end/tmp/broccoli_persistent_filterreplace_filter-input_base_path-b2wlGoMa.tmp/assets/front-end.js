"use strict";



define('front-end/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.RESTAdapter.extend({
        host: 'http://localhost:8082'
    });
});
define('front-end/app', ['exports', 'front-end/resolver', 'ember-load-initializers', 'front-end/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
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
define('front-end/components/add-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        questionModel: Ember.computed(function () {
            return this.get('store').findAll('question');
        }),
        actions: {
            addQuestion: function addQuestion() {
                var model = this.get('questionsModel');
                var obj = { id: this.get('questionCount') };
                this.set('questionCount', this.get('questionCount') + 1);
                model.push(obj);
                this.set('questionsModel', model);
                this.notifyPropertyChange('questionsModel');
            },
            openModal: function openModal() {
                var _this = this;

                this.set('name', null);
                this.set('description', null);
                this.set('questions', []);
                this.set('questionsModel', []);
                this.set('map', []);
                this.set('questionCount', 0);
                Ember.$('.ui.newForm.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var self = _this;
                        var myStore = _this.get('store');
                        if (!_this.get('name')) {
                            alert('Please enter a Name.');
                            return false;
                        }
                        if (!_this.get('description')) {
                            alert('Please enter a Description.');
                        }
                        for (var i = 0; i < _this.get('questionsModel').length; i++) {
                            if (!_this.get('questionsModel')[i].question) {
                                alert('Must select a Question for every added question.');
                                return false;
                            }
                        }
                        var newForm = myStore.createRecord('form', {
                            name: self.get('name'),
                            description: self.get('description'),
                            administrator: self.get('oudaAuth').getPerson()
                        });
                        newForm.save({ reload: true }).then(function () {
                            for (var i = 0; i < self.get('questionsModel').length; i++) {
                                var newQuestionsList = myStore.createRecord('questions-list', {
                                    form: newForm.id,
                                    question: self.get('questionsModel')[i].question
                                });
                                newQuestionsList.save();
                            }
                        }).then(function () {
                            alert('Form created.');
                        });
                    }
                }).modal('show');
            },
            removeQuestion: function removeQuestion(question) {
                var model = this.get('questionsModel');
                var index = model.indexOf(question);
                model.splice(index, 1);
                this.set('questionsModel', objModel);
                this.notifyPropertyChange('questionsModel');
            },
            selectQuestion: function selectQuestion(question, questionId) {
                for (var i = 0; i < this.get('questionsModel').length; i++) {
                    if (this.get('questionsModel')[i].id === question.id) {
                        var model = this.get('questionsModel');
                        model[i].question = questionId;
                        this.set('questionsModel', model);
                        return;
                    }
                }
            }
        }
    });
});
define('front-end/components/add-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        formModel: Ember.computed(function () {
            return this.get('store').findAll('form');
        }),

        actions: {
            openModal: function openModal() {
                var _this = this;

                this.set('name', null);
                this.set('form', null);
                Ember.$('.ui.newInjuryForm.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var newPost = _this.get('store').createRecord('injury-form', {
                            name: _this.get('name'),
                            form: _this.get('form').id
                        });
                        newPost.save().then(function () {
                            alert('saved.');
                        });
                        return true;
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/add-new-plan', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        exerciseModel: Ember.computed(function () {
            return this.get('store').findAll('exercise');
        }),
        formModel: Ember.computed(function () {
            return this.get('store').findAll('form');
        }),
        physiotherapistModel: Ember.computed(function () {
            return this.get('store').findAll('physiotherapist');
        }),
        modalName: Ember.computed(function () {
            return 'Modify-Plan' + this.get('ID');
        }),
        actions: {
            addAssessmentTest: function addAssessmentTest() {
                var model = this.get('assessmentTestModel');
                var obj = { name: 'Assessment Test Name ' + this.get('assessmentTestCount').toString(),
                    description: 'Assessment Test Description ' + this.get('assessmentTestCount').toString(),
                    id: this.get('assessmentTestCount') };
                this.set('assessmentTestCount', this.get('assessmentTestCount') + 1);
                var theMap = this.get('assessmentTestMap');
                theMap[obj.id] = null;
                this.set('assessmentTestMap', theMap);
                model.push(obj);
                this.set('assessmentTestModel', model);
                this.notifyPropertyChange('assessmentTestModel');
            },
            addExercisesList: function addExercisesList() {
                var model = this.get('exercisesListModel');
                var obj = { id: this.get('exercisesListCount') };
                this.set('exercisesListCount', this.get('exercisesListCount') + 1);
                var theMap = this.get('exercisesListMap');
                theMap[obj.id] = null;
                this.set('exercisesListMap', theMap);
                model.push(obj);
                this.set('exercisesListModel', model);
                this.notifyPropertyChange('exercisesListModel');
            },
            openModal: function openModal() {
                var _this = this;

                var self = this;
                this.set('name', null);
                this.set('description', null);
                this.set('goal', null);
                this.set('exercises', null);
                this.set('forms', null);
                this.set('assessmentTestModel', []);
                this.set('exercisesListModel', []);
                this.set('assessmentTestMap', []); // maps assessmentTests to the form that goes along with them
                this.set('exercisesListMap', []);
                this.set('assessmentTestCount', 0);
                this.set('exercisesListCount', 0);
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var DS = _this.get('DS');
                        var thisAssessmentTestMap = _this.get('assessmentTestMap');
                        var thisExercisesListMap = _this.get('exercisesListMap');
                        var thisAssessmentTestModel = _this.get('assessmentTestModel');
                        var thisExercisesListModel = _this.get('exercisesListModel');
                        var exerciseIds = [];
                        for (var i = 0; i < thisExercisesListModel.length; i++) {
                            var exerciseId = thisExercisesListMap[thisExercisesListModel[i].id];
                            if (!exerciseId) {
                                alert('Cannot leave any exercises un-selected.');
                                return false;
                            } else {
                                exerciseIds.push(exerciseId);
                            }
                        }
                        var assessmentTestJSONs = [];
                        for (var i = 0; i < thisAssessmentTestModel.length; i++) {
                            var formId = thisAssessmentTestMap[thisAssessmentTestModel[i].id];
                            if (!formId) {
                                alert('Cannot leave any assessment tests un-selected.');
                                return false;
                            } else {
                                var assessmentTestJSON = thisAssessmentTestModel[i];
                                assessmentTestJSON.form = formId;
                                assessmentTestJSONs.push(assessmentTestJSON);
                            }
                        }

                        if (!_this.get('name')) {
                            alert('Name must be non-empty');
                            return false;
                        }
                        for (var i = 0; i < assessmentTestJSONs.length; i++) {
                            if (!assessmentTestJSONs[i].name) {
                                alert('Name must be non-empty for every assessment test.');
                                return false;
                            }
                        }
                        var newRehabilitationPlan = DS.createRecord('rehabilitation-plan', {
                            name: _this.get('name'),
                            description: _this.get('description'),
                            physiotherapist: self.get('oudaAuth').getPerson(),
                            goal: _this.get('goal')
                        });
                        newRehabilitationPlan.save().then(function () {
                            for (var i = 0; i < exerciseIds.length; i++) {
                                var newExercisesList = DS.createRecord('exercises-list', {
                                    rehabilitationPlan: newRehabilitationPlan.id,
                                    exercise: exerciseIds[i]
                                });
                                newExercisesList.save();
                            }
                        }).then(function () {
                            for (var i = 0; i < assessmentTestJSONs.length; i++) {
                                var newAssessmentTest = DS.createRecord('assessment-test', {
                                    name: assessmentTestJSONs[i].name,
                                    description: assessmentTestJSONs[i].description,
                                    form: thisAssessmentTestMap[assessmentTestJSONs[i].id],
                                    rehabilitationPlan: newRehabilitationPlan.id
                                });
                                newAssessmentTest.save();
                            }
                        });
                        return true;
                    }
                }).modal('show');
            },
            removeAssessmentTest: function removeAssessmentTest(assessmentTest) {
                var objModel = this.get('assessmentTestModel');
                var index = objModel.indexOf(assessmentTest);
                objModel.splice(index, 1);
                this.set('assessmentTestModel', objModel);
                this.notifyPropertyChange('assessmentTestModel');
            },
            removeExercisesList: function removeExercisesList(exercisesList) {
                var objModel = this.get('exercisesListModel');
                var index = objModel.indexOf(exercisesList);
                objModel.splice(index, 1);
                this.set('exercisesListModel', objModel);
                this.notifyPropertyChange('exercisesListModel');
            },
            selectDate: function selectDate(date) {
                this.set('timeFrameToComplete', date);
            },
            selectExercise: function selectExercise(exercisesList, exercise) {
                var theMap = this.get('exercisesListMap');
                theMap[exercisesList.id.toString()] = exercise;
                this.set('exercisesListMap', theMap);
            },
            selectForm: function selectForm(assessment, form) {
                var theMap = this.get('assessmentTestMap');
                theMap[assessment.id.toString()] = form;
                this.set('assessmentTestMap', theMap);
            }
        }
    });
});
define('front-end/components/add-question', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        questionTypeModel: Ember.computed(function () {
            return this.get('store').findAll('question-type');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                this.set('questionText', null);
                this.set('helpDescription', null);
                this.set('questionType', null);
                Ember.$('.ui.newQuestion.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var self = _this;
                        var myStore = _this.get('store');

                        if (!self.get('questionText')) {
                            alert('Please enter Question Text.');
                            return false;
                        }
                        if (!self.get('helpDescription')) {
                            alert('Please enter a Help Description.');
                            return false;
                        }
                        if (!self.get('questionType')) {
                            alert('Please select a Question Type.');
                            return false;
                        }
                        var newQuestion = myStore.createRecord('question', {
                            questionText: self.get('questionText'),
                            helpDescription: self.get('helpDescription'),
                            questionType: self.get('questionType')
                        });
                        newQuestion.save().then(function () {
                            alert('Question created.');
                        });
                        return true;
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/appt-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    didInsertElement: function didInsertElement() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function () {
        var table = $('#example').DataTable();
      });
    }
  });
});
define('front-end/components/assessment-test-dropdown', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        assessmentTestModel: Ember.computed(function () {
            return this.get('store').findAll('assessment-test');
        }),
        actions: {
            addAssessmentTest: function addAssessmentTest(value) {
                // Selected an assessment test that has already been chosen
                if (this.chosenAssessmentTests.contains(value)) {
                    this.chosenAssessmentTests.splice(this.chosenAssessmentTests.indexOf(value), 1);
                    this.$('#list').empty();
                    for (var i = 0; i < this.chosenAssessmentTests.length; i++) {
                        this.$('#list').append('<li>' + value + '</li>');
                    }
                }
                // Selected a new assessment test
                else {
                        this.chosenAssessmentTests.push(value);
                        this.$('#list').append('<li>' + value + '</li>');
                    }
            }
        },
        chosenAssessmentTests: []
    });
});
define('front-end/components/assign-plan', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        rehabilitationPlanModel: Ember.computed(function () {
            return this.get('store').findAll('rehabilitation-plan');
        }),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            addTreatment: function addTreatment() {
                var model = this.get('treatmentModel');
                var obj = { id: this.get('treatmentCount') };
                this.set('treatmentCount', this.get('treatmentCount') + 1);
                var theMap = this.get('treatmentMap');
                theMap[obj.id] = { rehabilitationPlan: null, physiotherapist: null };
                this.set('treatmentMap', theMap);
                model.push(obj);
                this.set('treatmentModel', model);
                this.notifyPropertyChange('treatmentModel');
            },
            openModal: function openModal() {
                var _this = this;

                var self = this;

                var obj = this;
                var DS = this.get('DS');

                function findExistingTreatments(index) {
                    if (index !== obj.get('existingTreatments').length) {
                        DS.findRecord('treatment', obj.get('existingTreatments')[index], { reload: true }).then(function (treatment) {
                            var treatmentJSON = JSON.parse(JSON.stringify(treatment));
                            treatmentJSON.id = treatment.id;
                            var model = obj.get('existingTreatments');
                            model[index] = treatmentJSON;
                            obj.set('existingTreatments', model);
                            findExistingTreatments(index + 1);
                        });
                    } else {
                        findExistingRehabilitationPlans(0);
                    }
                }

                function findExistingRehabilitationPlans(index) {
                    if (index !== obj.get('existingTreatments').length) {
                        DS.findRecord('rehabilitation-plan', obj.get('existingTreatments')[index].rehabilitationPlan, { reload: true }).then(function (rehabilitationPlan) {
                            var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                            rehabilitationPlanJSON.id = rehabilitationPlan.id;
                            var model = obj.get('existingTreatments');
                            model[index].rehabilitationPlan = rehabilitationPlanJSON;
                            findExistingRehabilitationPlans(index + 1);
                        });
                    } else {
                        obj.notifyPropertyChange('existingTreatments');
                    }
                }

                this.set('treatmentMap', []);
                this.set('treatmentModel', []);
                this.set('existingTreatments', []);
                this.set('treatmentCount', 0);

                DS.findRecord('patient-profile', this.get('ID'), { reload: true }).then(function (patientProfile) {
                    obj.set('existingTreatments', patientProfile.get('treatments'));
                    findExistingTreatments(0);
                });

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var obj = _this;
                        var DS = _this.get('DS');
                        var thisTreatmentModel = _this.get('treatmentModel');
                        var thisTreatmentMap = _this.get('treatmentMap');
                        var rehabilitationPlanIds = [];
                        var physiotherapistIds = [];

                        for (var i = 0; i < thisTreatmentModel.length; i++) {
                            var rehabilitationPlanId = thisTreatmentMap[thisTreatmentModel[i].id].rehabilitationPlan;
                            if (!rehabilitationPlanId) {
                                alert('Cannot leave any Rehabilitation Plans un-selected.');
                                return false;
                            } else {
                                rehabilitationPlanIds.push(rehabilitationPlanId);
                            }
                        }

                        function updateTreatments(iIndex, jIndex) {
                            if (iIndex !== oldTreatments.length) {
                                if (jIndex !== obj.get('existingTreatments').length) {
                                    if (obj.get('existingTreatments')[jIndex].id === oldTreatments[iIndex]) {
                                        updateTreatments(iIndex + 1, 0);
                                    } else {
                                        updateTreatments(iIndex, jIndex + 1);
                                    }
                                } else {
                                    DS.findRecord('treatment', oldTreatments[iIndex], { reload: true }).then(function (treatment) {
                                        treatment.destroyRecord().then(function () {
                                            updateTreatments(iIndex + 1, 0);
                                        });
                                    });
                                }
                            }
                        }

                        var oldTreatments;

                        DS.findRecord('patient-profile', _this.get('ID'), { reload: true }).then(function (patientProfile) {
                            oldTreatments = patientProfile.get('treatments');
                            updateTreatments(0, 0);
                        }).then(function () {
                            for (var i = 0; i < thisTreatmentModel.length; i++) {
                                var newTreatment = DS.createRecord('treatment', {
                                    dateAssigned: new Date(),
                                    physiotherapist: self.get('oudaAuth').getPerson(),
                                    rehabilitationPlan: thisTreatmentMap[thisTreatmentModel[i].id].rehabilitationPlan,
                                    patientProfile: obj.get('ID')
                                });
                                newTreatment.save();
                            }
                        });
                    }
                }).modal('show');
            },
            removeExistingTreatment: function removeExistingTreatment(treatment) {
                var objModel = this.get('existingTreatments');
                var index = objModel.indexOf(treatment);
                objModel.splice(index, 1);
                this.set('existingTreatments', objModel);
                this.notifyPropertyChange('existingTreatments');
            },
            removeTreatment: function removeTreatment(treatment) {
                var objModel = this.get('treatmentModel');
                var index = objModel.indexOf(treatment);
                objModel.splice(index, 1);
                this.set('treatmentModel', objModel);
                this.notifyPropertyChange('treatmentModel');
            },
            selectPhysiotherapist: function selectPhysiotherapist(treatment, physiotherapist) {
                var theMap = this.get('treatmentMap');
                theMap[treatment.id.toString()].physiotherapist = physiotherapist;
                this.set('treatmentMap', theMap);
                this.notifyPropertyChange('treatmentMap');
            },
            selectRehabilitationPlan: function selectRehabilitationPlan(treatment, rehabilitationPlan) {
                var theMap = this.get('treatmentMap');
                theMap[treatment.id.toString()].rehabilitationPlan = rehabilitationPlan;
                this.set('treatmentMap', theMap);
                this.notifyPropertyChange('treatmentMap');
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
define('front-end/components/authenticate-user', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                this.set('email', null);
                this.set('encryptedAuth', null);
                Ember.$('.ui.authenticateUser.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        // fetch('http://localhost:8082/selfStartUsers')
                        // .then(function(response){
                        //     return response.json();
                        // })
                        // .then(function(myJson){
                        //     var found = false;
                        //     var selfStartUser;
                        //     var email = this.get('email');
                        //     for(var i = 0; i < myJson.selfStartUser.length; i++){
                        //         if(userAccount[i].email === email){
                        //             found = true;
                        //             selfStartUser = myJson.selfStartUser[i];
                        //             break;
                        //         }
                        //     }
                        //     if(found){

                        //     }
                        //     else{

                        //     }
                        // });
                        var email = _this.get('email');
                        var encryptedAuth = _this.get('encryptedAuth');
                        var found = false;
                        var DS = _this.get('DS');
                        _this.get('store').findAll('self-start-user').then(function (selfStartUsers) {
                            var theSelfStartUser;
                            selfStartUsers.forEach(function (selfStartUser) {
                                var selfStartUserJSON = JSON.parse(JSON.stringify(selfStartUser));
                                if (selfStartUserJSON.email === email) {
                                    found = true;
                                    theSelfStartUser = selfStartUserJSON;
                                }
                            });
                            if (found) {
                                DS.find('user-account', theSelfStartUser.userAccount).then(function (userAccount) {
                                    userAccount.set('encryptedAuth', encryptedAuth);
                                    userAccount.save().then(function () {
                                        DS.find('user-account', theSelfStartUser.userAccount).then(function (updatedUserAccount) {
                                            if (updatedUserAccount.get('encryptedAuth') == '') {
                                                alert('User authenticated.');
                                            } else {
                                                alert('authentication failed, check email for new authentication code');
                                            }
                                        });
                                        return true;
                                    });
                                });
                            } else {
                                alert("Invalid email");
                            }
                        });
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/client-report', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        questionModel: Ember.computed(function () {
            return this.get('store').findAll('question');
        }),
        assessmentTestModel: Ember.computed(function () {
            return this.get('store').findAll('assessment-test');
        }),
        profileModel: Ember.computed(function () {
            return this.get('store').findAll('patientProfile');
            //fix to work wit fname/lname
        }),

        pairModel: [],
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Client-Report' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').find('form', _this.get('form').id).then(function (form) {
                            //fix these - new model with fname and lname passes etc. (passed in forms.hbs)
                            form.set('name', _this.get('name'));
                            form.set('description', _this.get('description'));
                            form.set('administrator', _this.get('administrator'));
                            form.set('assessmentTests', _this.get('assessmentTests'));
                            form.set('questions', _this.get('questions'));
                            form.save().then(function () {
                                return true;
                            });
                        });
                    }
                }).modal('show');
            }
        },
        didInsertElement: function didInsertElement() {
            /* Init the table and fire off a call to get the hidden nodes. */
            $(document).ready(function () {
                var table = $('#example').DataTable();
            });
        }
    });
});
define('front-end/components/complete-injury-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),
    postsData: null,
    title: Ember.computed.oneWay('postsData.title'),
    body: Ember.computed.oneWay('postsData.body'),
    modalName: Ember.computed(function () {
      return 'Injury-Form' + this.get('ID');
    }),
    actions: {
      clicky: function clicky(value) {
        this.set("someAttr", value);
      },

      openModal: function openModal() {
        var _this = this;

        var self = this;
        var myStore = this.get('store');
        this.set('email', '');

        var questionsListsMap = [];
        var questionsMap = [];
        for (var i = 0; i < this.get('injuryForm').form.questionsLists.length; i++) {
          questionsListsMap[this.get('injuryForm').form.questionsLists[i]] = 1;
        }
        var uniqueCount = 0;
        myStore.findAll('questions-list', { reload: true }).then(function (questionsLists) {
          questionsLists.forEach(function (questionsList) {
            if (questionsListsMap[questionsList.id]) {
              var questionsListJSON = JSON.parse(JSON.stringify(questionsList));
              questionsListJSON.id = questionsList.id;
              questionsListJSON.unique = 'Answer ' + uniqueCount.toString();
              uniqueCount++;
              questionsListsMap[questionsList.id] = questionsListJSON;
              questionsMap[questionsListJSON.question] = 1;
            }
          });
          return myStore.findAll('question', { reload: true });
        }).then(function (questions) {
          questions.forEach(function (question) {
            if (questionsMap[question.id]) {
              var questionJSON = JSON.parse(JSON.stringify(question));
              questionJSON.id = question.id;
              questionsMap[question.id] = questionJSON;
            }
          });
          for (var key in questionsMap) {
            if (questionsMap.hasOwnProperty(key)) {
              for (var i = 0; i < questionsMap[key].questionsLists.length; i++) {
                questionsMap[key].questionsLists[i] = questionsListsMap[questionsMap[key].questionsLists[i]];
              }
            }
          }
          for (var key in questionsListsMap) {
            if (questionsListsMap.hasOwnProperty(key)) {
              questionsListsMap[key].question = questionsMap[questionsListsMap[key].question];
              questionsListsMap[key].form = self.get('injuryForm').form;
            }
          }
          for (var i = 0; i < self.get('injuryForm').form.questionsLists.length; i++) {
            self.get('injuryForm').form.questionsLists[i] = questionsListsMap[self.get('injuryForm').form.questionsLists[i]];
          }
          self.notifyPropertyChange('injuryForm');
        });

        Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
          closable: false,
          transition: 'fade',
          onDeny: function onDeny() {
            return true;
          },
          onApprove: function onApprove() {
            if (!_this.get('email')) {
              alert('Please enter your email.');
              return false;
            }

            var newCompletedInjuryForm = myStore.createRecord('completed-injury-form', {
              email: self.get('email'),
              date: new Date(),
              injuryForm: self.get('injuryForm').id
            });
            newCompletedInjuryForm.save({ reload: true }).then(function () {
              function addInjuryResults(index) {
                if (index !== self.get('injuryForm').form.questionsLists.length) {
                  var newInjuryResult = myStore.createRecord('injury-result', {
                    questionText: self.get('injuryForm').form.questionsLists[index].question.questionText,
                    answer: self.get('injuryForm').form.questionsLists[index].unique,
                    completedInjuryForm: newCompletedInjuryForm.id
                  });
                  return newInjuryResult.save({ reload: true }).then(function () {
                    return addInjuryResults(index + 1);
                  });
                } else {
                  alert('Injury Form Completed.');
                }
              }

              addInjuryResults(0);
            });
          }
        }).modal('show');
      },
      didInsertElement: function didInsertElement() {
        /* Init the table and fire off a call to get the hidden nodes. */
        Ember.$(document).ready(function () {
          var table = Ember.$('#example').DataTable();
        });
      }
    }

  });
});
define('front-end/components/complete-test', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Assesment-Test' + this.get('ID');
        }),
        actions: {
            clicky: function clicky(value) {
                this.set("someAttr", value);
            },

            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');

                for (var i = 0; i < this.get('assessmentTest').form.questionsLists.length; i++) {
                    this.get('assessmentTest').form.questionsLists[i].unique = 'Answer ' + i.toString();
                }

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        function addTestResults(index) {
                            if (index !== self.get('assessmentTest').form.questionsLists.length) {
                                var newTestResult = myStore.createRecord('test-result', {
                                    question: self.get('assessmentTest').form.questionsLists[index].question.questionText,
                                    answer: self.get('assessmentTest').form.questionsLists[index].unique,
                                    assessmentTest: self.get('assessmentTest').id,
                                    treatment: self.get('treatment').id
                                });
                                return newTestResult.save({ reload: true }).then(function () {
                                    return addTestResults(index + 1);
                                });
                            } else {
                                alert('Assessment Test Complete.');
                            }
                        }
                        addTestResults(0);
                    }
                }).modal('show');
            },
            didInsertElement: function didInsertElement() {
                /* Init the table and fire off a call to get the hidden nodes. */
                Ember.$(document).ready(function () {
                    var table = Ember.$('#example').DataTable();
                });
            }
        }

    });
});
define("front-end/components/contact-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    actions: {
      sendMessage: function sendMessage() {
        var name = this.get("name");
        var email = this.get("email");
        var phone = this.get("phone");
        var message = this.get("message");
        if (name == undefined || email == undefined || phone == undefined || message == undefined) {
          alert("Please fill out all fields");
        } else {
          fetch('http://localhost:8082/mail/' + name + '/' + email + '/' + phone + '/' + message).then(function (response) {
            alert('Message sent!');
          });
        }
      }
    }
  });
});
define('front-end/components/country-dropdown', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        })
    });
});
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
define('front-end/components/data-table', ['exports', 'ember-datatables/components/data-table'], function (exports, _dataTable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _dataTable.default;
    }
  });
});
define('front-end/components/delete-exercise', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        modalName: Ember.computed(function () {
            return 'Delete-Exercise' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').findRecord('exercise', _this.get('ID'), { reload: true }).then(function (post) {
                            post.destroyRecord().then(function () {
                                return true;
                            });
                        });
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/delete-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        modalName: Ember.computed(function () {
            return 'Delete-Plans' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').find('form', _this.get('ID'), { reload: true }).then(function (post) {
                            post.destroyRecord().then(function () {
                                return true;
                            });
                        });
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/delete-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        modalName: Ember.computed(function () {
            return 'Delete-Injury-Forms' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var myStore = this.get('store');
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        myStore.findRecord('injuryForm', _this.get('ID'), { reload: true }).then(function (injuryForm) {
                            injuryForm.destroyRecord().then(function () {
                                alert('Injury Form deleted.');
                            });
                        });
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
define('front-end/components/delete-plan', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        modalName: Ember.computed(function () {
            return 'Delete-Plans' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').findRecord('rehabilitationPlan', _this.get('ID'), { reload: true }).then(function (post) {
                            post.destroyRecord().then(function () {
                                return true;
                            });
                        });
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/delete-question', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        DS: Ember.inject.service('store'),
        modalName: Ember.computed(function () {
            return 'Delete-Questions' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        _this.get('DS').find('question', _this.get('ID'), { reload: true }).then(function (question) {
                            return question.destroyRecord();
                        });
                        return true;
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/exercise-dropdown', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        actions: {
            addExercise: function addExercise(value) {
                // Exercise is already in the list
                if (this.chosenExercises.includes(value)) {
                    this.chosenExercises.splice(this.chosenExercises.indexOf(value), 1);
                    this.$('#list').empty();
                    for (var i = 0; i < this.chosenExercises.length; i++) {
                        this.$('#list').append('<li>' + this.chosenExercises[i] + '</li>');
                    }
                }
                // Exercise is not in the list
                else {
                        this.chosenExercises.push(value);
                        this.$('ol').append('<li>' + value + '</li>');
                    }
            }
        },
        chosenExercises: []
    });
});
define('front-end/components/forgot-password', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var self = this;
                var myStore = this.get('store');

                this.set('sent', false);
                this.set('userAccountName', '');
                this.set('newPassword', '');
                this.set('confirmPassword', '');
                this.set('authenticationCode', '');

                var userAccount;
                Ember.$('.ui.changePassword.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!_this.get('sent')) {
                            console.log('1');
                            if (!_this.get('userAccountName')) {
                                alert('Please enter a User Account Name.');
                                return false;
                            }
                            if (!_this.get('newPassword') || _this.get('newPassword') !== _this.get('confirmPassword')) {
                                alert('Please enter 2 matching passwords.');
                                return false;
                            }
                            myStore.findAll('userAccount', { reload: true }).then(function (userAccounts) {
                                console.log('2');
                                userAccounts.forEach(function (theUserAccount) {
                                    console.log(theUserAccount.get('userAccountName'));
                                    if (theUserAccount.get('userAccountName') === self.get('userAccountName').toLowerCase()) {
                                        console.log('4');
                                        userAccount = theUserAccount;
                                        return;
                                    }
                                });
                                if (!userAccount) {
                                    throw new Error('Invalid User Account Name.');
                                }
                                return myStore.findRecord('userAccount', userAccount.id, { reload: true });
                            }).then(function (theUserAccount) {
                                theUserAccount.set('passwordMustChanged', true);
                                return theUserAccount.save({ reload: true });
                            }).then(function () {
                                console.log('5');
                                self.set('sent', true);
                                self.notifyPropertyChange('set');
                                return false;
                            }).catch(function (err) {
                                alert(err);
                                return false;
                            });

                            return false;
                        } else {
                            userAccount.set('passwordMustChanged', false);
                            userAccount.set('authenticationCode', self.get('authenticationCode'));
                            userAccount.set('encryptedPassword', self.get('oudaAuth').hash(self.get('newPassword')));
                            userAccount.save({ reload: true }).then(function () {
                                return myStore.findRecord('userAccount', userAccount.id, { reload: true });
                            }).then(function (theUserAccount) {
                                if (theUserAccount.get('authenticationCode')) {
                                    alert('Incorrect authentication code.');
                                } else {
                                    alert('Password successfully changed!');
                                }
                            }).catch(function (err) {
                                alert(err);
                                return false;
                            });
                            return false;
                        }
                    }
                }).modal('show');
            }
        }
    });
});
define('front-end/components/generate-data', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        actions: {
            generateData: function generateData() {
                var store = this.get('store');
                var DS = this.get('DS');

                function randomId(modelName) {
                    for (var i = 0; i < modelIds.length; i++) {
                        if (modelIds[i].name === modelName) {
                            return modelIds[i].list[Math.floor(modelIds[i].list.length * Math.random())];
                        }
                    }
                }

                function saveFunc(iIndex, jIndex) {
                    if (iIndex !== modelLists.length) {
                        if (jIndex !== modelLists[iIndex].length) {
                            return modelLists[iIndex][jIndex].save({ reload: true }).then(function () {
                                return saveFunc(iIndex, jIndex + 1);
                            }).catch(function (err) {
                                console.log(err);
                                throw new Error(err);
                            });
                        } else {
                            return saveFunc(iIndex + 1, 0).catch(function (err) {
                                console.log(err);
                                throw new Error(err);
                            });
                        }
                    } else {
                        modelLists = [];
                        iteration++;

                        return findIds(0).catch(function (err) {
                            console.log(err);
                            throw new Error(err);
                        });
                    }
                }

                function findIds(index) {
                    if (index !== modelIds.length) {
                        return DS.findAll(modelIds[index].name, { reload: true }).then(function (models) {
                            models.forEach(function (model) {
                                modelIds[index].list.push(model.id);
                            });
                            return findIds(index + 1);
                        }).catch(function (err) {
                            console.log(err);
                            throw new Error(err);
                        });
                    } else {
                        if (iteration == 1) {
                            console.log('Done first iteration.');
                            var forms = [];
                            modelLists.push(forms);
                            modelIds.push({ name: 'form', list: [] });

                            for (var i = 0; i < 15; i++) {
                                forms.push(DS.createRecord('form', {
                                    name: 'Form_Name_' + i.toString(),
                                    description: 'Form_Description_' + i.toString(),
                                    administrator: randomId('administrator')
                                }));
                            }

                            var questions = [];
                            modelLists.push(questions);
                            modelIds.push({ name: 'question', list: [] });

                            for (var i = 0; i < 30; i++) {
                                questions.push(DS.createRecord('question', {
                                    questionText: 'Question_QuestionText_' + i.toString(),
                                    helpDescription: 'Question_HelpDescription_' + i.toString(),
                                    questionType: randomId('questionType')
                                }));
                            }

                            var patientProfiles = [];
                            modelLists.push(patientProfiles);
                            modelIds.push({ name: 'patientProfile', list: [] });

                            for (var i = 0; i < 50; i++) {
                                patientProfiles.push(DS.createRecord('patientProfile', {
                                    familyName: 'PatientProfile_FamilyName_' + i.toString(),
                                    givenName: 'PatientProfile_GivenName_' + i.toString(),
                                    email: 'PatientProfile_Email_' + i.toString(),
                                    DOB: new Date(),
                                    postalCode: 'PatientProfile_PostalCode_' + i.toString(),
                                    phone: 'PatientProfile_Phone_' + i.toString(),
                                    maritalStatus: 'PatientProfile_MaritalStatus_' + i.toString(),
                                    occupation: 'PatientProfile_Occupation_' + i.toString(),
                                    country: randomId('country'),
                                    province: randomId('province'),
                                    city: randomId('city'),
                                    gender: randomId('gender')
                                }));
                            }

                            var rehabilitationPlans = [];
                            modelLists.push(rehabilitationPlans);
                            modelIds.push({ name: 'rehabilitationPlan', list: [] });

                            for (var i = 0; i < 10; i++) {
                                rehabilitationPlans.push(DS.createRecord('rehabilitationPlan', {
                                    name: 'RehabilitationPlan_Name_' + i.toString(),
                                    description: 'RehabilitationPlan_Description_' + i.toString(),
                                    physiotherapist: randomId('physiotherapist'),
                                    goal: 'RehabilitationPlan_Goal_' + i.toString(),
                                    timeFrameToComplete: new Date()
                                }));
                            }

                            var exercises = [];
                            modelLists.push(exercises);
                            modelIds.push({ name: 'exercise', list: [] });

                            for (var i = 0; i < 25; i++) {
                                exercises.push(DS.createRecord('exercise', {
                                    name: 'Exercise_Name_' + i.toString(),
                                    description: 'Exercise_Description_' + i.toString(),
                                    objectives: ['Exercuse_Objectives_' + i.toString()],
                                    physiotherapist: randomId('physiotherapist'),
                                    actionSteps: ['Exercise_ActionSteps_' + i.toString()],
                                    location: 'Exercise_Location_' + i.toString(),
                                    frequency: i,
                                    duration: i,
                                    targetDate: new Date()
                                }));
                            }
                        } else if (iteration == 2) {
                            console.log('Done second iteration.');
                            var questionsLists = [];
                            modelLists.push(questionsLists);
                            modelIds.push({ name: 'questionsList', list: [] });

                            for (var i = 0; i < 30; i++) {
                                questionsLists.push(DS.createRecord('questionsList', {
                                    form: randomId('form'),
                                    question: randomId('question')
                                }));
                            }

                            var treatments = [];
                            modelLists.push(treatments);
                            modelIds.push({ name: 'treatment', list: [] });

                            for (var i = 0; i < 50; i++) {
                                treatments.push(DS.createRecord('treatment', {
                                    dateAssigned: new Date(),
                                    physiotherapist: randomId('physiotherapist'),
                                    rehabilitationPlan: randomId('rehabilitationPlan'),
                                    patientProfile: randomId('patientProfile')
                                }));
                            }

                            var exercisesLists = [];
                            modelLists.push(exercisesLists);
                            modelIds.push({ name: 'exercisesList', list: [] });

                            for (var i = 0; i < 50; i++) {
                                exercisesLists.push(DS.createRecord('exercisesList', {
                                    rehabilitationPlan: randomId('rehabilitationPlan'),
                                    exercise: randomId('exercise')
                                }));
                            }

                            var payments = [];
                            modelLists.push(payments);
                            modelIds.push({ name: 'payment', list: [] });

                            for (var i = 0; i < 30; i++) {
                                payments.push(DS.createRecord('payment', {
                                    dayTimeStamp: new Date(),
                                    amount: i,
                                    note: 'Payment_Note_' + i.toString(),
                                    patientProfile: randomId('patientProfile')
                                }));
                            }

                            var appointments = [];
                            modelLists.push(appointments);
                            modelIds.push({ name: 'appointment', list: [] });

                            for (var i = 0; i < 1; i++) {
                                appointments.push(DS.createRecord('appointment', {
                                    date: new Date(),
                                    reason: 'Appointment_Reason_' + i.toString(),
                                    other: 'Appointment_Other_' + i.toString(),
                                    patientProfile: randomId('patientProfile')
                                }));
                            }

                            var assessmentTests = [];
                            modelLists.push(assessmentTests);
                            modelIds.push({ name: 'assessmentTest', list: [] });

                            for (var i = 0; i < 40; i++) {
                                assessmentTests.push(DS.createRecord('assessmentTest', {
                                    name: 'AssessmentTest_Name_' + i.toString(),
                                    description: 'AssessmentTest_Description_' + i.toString(),
                                    rehabilitationPlan: randomId('rehabilitationPlan'),
                                    form: randomId('form')
                                }));
                            }

                            var injuryForms = [];
                            modelLists.push(injuryForms);
                            modelIds.push({ name: 'injuryForm', list: [] });

                            for (var i = 0; i < 30; i++) {
                                injuryForms.push(DS.createRecord('injuryForm', {
                                    name: 'InjuryForm_Name_' + i.toString(),
                                    form: randomId('form')
                                }));
                            }

                            var images = [];
                            modelLists.push(images);
                            modelIds.push({ name: 'image', list: [] });

                            var chosenIds = [];

                            while (true) {
                                if (chosenIds.length === 25) {
                                    break;
                                }
                                var exerciseId = randomId('exercise');
                                if (chosenIds.indexOf(exerciseId) != -1) {
                                    continue;
                                } else {
                                    chosenIds.push(exerciseId);
                                    images.push(DS.createRecord('image', {
                                        name: 'Image_Name_' + i.toString(),
                                        type: 'Image_Type_' + i.toString(),
                                        size: 'Image_Size_' + i.toString(),
                                        rawSize: i,
                                        imageData: 'Image_Data_' + i.toString(),
                                        exercise: exerciseId,
                                        patientProfile: null
                                    }));
                                }
                            }
                        } else if (iteration == 3) {
                            console.log('Done third iteration.');
                            var testResults = [];
                            modelLists.push(testResults);
                            modelIds.push({ name: 'testResult', list: [] });

                            for (var i = 0; i < 50; i++) {
                                testResults.push(DS.createRecord('testResult', {
                                    question: 'TestResult_Question_' + i.toString(),
                                    answer: 'TestResult_Answer_' + i.toString(),
                                    assessmentTest: randomId('assessmentTest'),
                                    treatment: randomId('treatment')
                                }));
                            }

                            var recommendations = [];
                            modelLists.push(recommendations);
                            modelIds.push({ name: 'recommendation', list: [] });

                            for (var i = 0; i < 75; i++) {
                                recommendations.push(DS.createRecord('recommendation', {
                                    timeStamp: new Date(),
                                    decision: 'Recommendation_Decision_' + i.toString(),
                                    assessmentTest: randomId('assessmentTest'),
                                    treatment: randomId('treatment')
                                }));
                            }

                            var completedInjuryForms = [];
                            modelLists.push(completedInjuryForms);
                            modelIds.push({ name: 'completedInjuryForm', list: [] });

                            for (var i = 0; i < 50; i++) {
                                completedInjuryForms.push(DS.createRecord('completedInjuryForm', {
                                    date: new Date(),
                                    injuryForm: randomId('injuryForm')
                                }));
                            }
                        } else if (iteration == 4) {
                            console.log('Done fourth iteration.');
                            var injuryResults = [];
                            modelLists.push(injuryResults);
                            modelIds.push({ name: 'injuryResult', list: [] });

                            for (var i = 0; i < 30; i++) {
                                injuryResults.push(DS.createRecord('injuryResult', {
                                    questionText: 'InjuryResult_QuestionText_' + i.toString(),
                                    answer: 'InjuryResult_Answer_' + i.toString(),
                                    completedInjuryForm: randomId('completedInjuryForm')
                                }));
                            }
                        } else {
                            console.log('Done fifth iteration.');
                            return;
                        }

                        // Clear the collection of model id's
                        for (var i = 0; i < modelIds.length; i++) {
                            modelIds[i].list = [];
                        }
                        return saveFunc(0, 0);
                    }
                }

                var iteration = 0;
                var modelLists = []; // data to be posted to Ember
                var modelNames = []; // model names
                var modelIds = []; // list of already saved model names with their list of id's

                var countries = [];
                modelLists.push(countries);
                modelIds.push({ name: 'country', list: [] });

                for (var i = 0; i < 10; i++) {
                    countries.push(DS.createRecord('country', {
                        name: 'Country_Name_' + i.toString()
                    }));
                }

                var provinces = [];
                modelLists.push(provinces);
                modelIds.push({ name: 'province', list: [] });

                for (var i = 0; i < 25; i++) {
                    provinces.push(DS.createRecord('province', {
                        name: 'Province_Name_' + i.toString()
                    }));
                }

                var cities = [];
                modelLists.push(cities);
                modelIds.push({ name: 'city', list: [] });

                for (var i = 0; i < 35; i++) {
                    cities.push(DS.createRecord('city', {
                        name: 'City_Name_' + i.toString()
                    }));
                }

                var genders = [];
                modelLists.push(genders);
                modelIds.push({ name: 'gender', list: [] });

                for (var i = 0; i < 5; i++) {
                    genders.push(DS.createRecord('gender', {
                        name: 'Gender_Name_' + i.toString()
                    }));
                }

                var administrators = [];
                modelLists.push(administrators);
                modelIds.push({ name: 'administrator', list: [] });

                for (var i = 0; i < 3; i++) {
                    administrators.push(DS.createRecord('administrator', {
                        familyName: 'Administrator_FamilyName_' + i.toString(),
                        givenName: 'Administrator_GivenName_' + i.toString(),
                        email: 'Administrator_Email_' + i.toString(),
                        dateHired: new Date(),
                        dateFinished: new Date()
                    }));
                }

                var physiotherapists = [];
                modelLists.push(physiotherapists);
                modelIds.push({ name: 'physiotherapist', list: [] });

                for (var i = 0; i < 10; i++) {
                    physiotherapists.push(DS.createRecord('physiotherapist', {
                        familyName: 'Physiotherapist_FamilyName_' + i.toString(),
                        givenName: 'Physiotherapist_GivenName_' + i.toString(),
                        email: 'Physiotherapist_Email_' + i.toString(),
                        dateHired: new Date(),
                        dateFinished: new Date()
                    }));
                }

                var questionTypes = [];
                modelLists.push(questionTypes);
                modelIds.push({ name: 'questionType', list: [] });

                var questionTypeNames = ['t/f', 'textField', 'onetoten'];

                for (var i = 0; i < 3; i++) {
                    questionTypes.push(DS.createRecord('questionType', {
                        name: questionTypeNames[i]
                    }));
                }

                saveFunc(0, 0).then(function () {
                    alert('Done creating all data!');
                }).catch(function (err) {
                    alert(err);
                });
            }
        }
    });
});
define('front-end/components/log-out', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        actions: {
            logout: function logout() {
                var authentication = this.get('oudaAuth');
                if (authentication.userCList) {
                    var identity = localStorage.getItem('sas-session-id');
                    var name = authentication.decrypt(identity);
                    authentication.close(name);
                }
            }
        }
    });
});
define('front-end/components/login-user', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        router: Ember.inject.service(),
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        error: null,
        tempPassword: null,
        isPasswordChanging: null,
        actions: {
            login: function login() {
                var authentication = this.get('oudaAuth');
                var self = this;
                if (!self.get('userAccountName')) {
                    alert('Please enter your User Account Name.');
                    return false;
                }
                if (!self.get('password')) {
                    alert('Please enter your Password.');
                    return false;
                }
                self.set('error', null);
                authentication.open(this.get('userAccountName').toLowerCase(), this.get('password')).then(function () {
                    self.get('oudaAuth').set('isLoginRequested', false);
                    authentication.set('getName', self.get('userAccountName').toLowerCase());
                    self.get('router').transitionTo('home');
                }).catch(function (err) {
                    alert(err);
                });
            }
        }
    });
});
define('front-end/components/modify-admin-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        profileModel: Ember.computed(function () {
            //patientProfile
            return this.get('store').findAll('patientProfile');
        }),
        userAccountModel: Ember.computed(function () {
            //userAccount
            return this.get('store').findAll('user-account');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var obj = this;
                var DS = this.get('DS');
                var admin;
                DS.find('administrator', this.get('ID')).then(function (record) {
                    obj.set('givenName', record.get('givenName'));
                    obj.set('familyName', record.get('familyName'));
                    admin = record;
                });
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        admin.set('givenName', self.get('givenName'));
                        admin.set('familyName', self.get('familyName'));
                        admin.save({ reload: true }).then(function () {
                            alert('Administrator Changes Saved.');
                        });
                    }
                }).modal('show');
            },
            selectDateHired: function selectDateHired(date) {
                this.set('dateHired', date);
            },
            selectDateFinished: function selectDateFinished(date) {
                this.set('dateFinished', date);
            },
            didInsertElement: function didInsertElement() {
                /* Init the table and fire off a call to get the hidden nodes. */
                Ember.$(document).ready(function () {
                    var table = Ember.$('#example').DataTable();
                });
            }
        }
    });
});
define('front-end/components/modify-client-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var obj = this;
                var DS = this.get('DS');
                var patient;
                DS.find('patient-profile', this.get('ID')).then(function (record) {
                    obj.set('givenName', record.get('givenName'));
                    obj.set('familyName', record.get('familyName'));
                    obj.set('postalCode', record.get('postalCode'));
                    obj.set('phone', record.get('phone'));
                    obj.set('country', record.get('country'));
                    obj.set('province', record.get('province'));
                    obj.set('city', record.get('city'));
                    patient = record;
                });
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        if (!self.get('country')) {
                            alert('Please select a Country.');
                            return false;
                        }
                        if (!self.get('province')) {
                            alert('Please select a Province.');
                            return false;
                        }
                        if (!self.get('city')) {
                            alert('Please select a City.');
                            return false;
                        }
                        patient.set('givenName', self.get('givenName'));
                        patient.set('familyName', self.get('familyName'));
                        patient.set('postalCode', self.get('postalCode'));
                        patient.set('phone', self.get('phone'));
                        patient.set('country', self.get('country'));
                        patient.set('province', self.get('province'));
                        patient.set('city', self.get('city'));
                        patient.save({ reload: true }).then(function () {
                            alert('Client Changes Saved.');
                        });
                    }
                }).modal('show');
            },
            selectDateHired: function selectDateHired(date) {
                this.set('dateHired', date);
            },
            selectDateFinished: function selectDateFinished(date) {
                this.set('dateFinished', date);
            },
            didInsertElement: function didInsertElement() {
                /* Init the table and fire off a call to get the hidden nodes. */
                Ember.$(document).ready(function () {
                    var table = Ember.$('#example').DataTable();
                });
            }
        }
    });
});
define('front-end/components/modify-client', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var obj = this;
                var DS = this.get('DS');
                DS.find('patientProfile', this.get('ID')).then(function (record) {
                    obj.set('patient', record);
                    obj.set('givenName', record.get('givenName'));
                    obj.set('familyName', record.get('familyName'));
                    obj.set('DOB', record.get('DOB'));
                    obj.set('postalCode', record.get('postalCode'));
                    obj.set('phone', record.get('phone'));
                    obj.set('maritalStatus', record.get('maritalStatus'));
                    obj.set('occupation', record.get('occupation'));
                    return DS.find('country', record.get('country'));
                }).then(function (record) {
                    obj.set('country', record);
                    return DS.find('province', obj.get('patient').get('province'));
                }).then(function (record) {
                    obj.set('province', record);
                    return DS.find('city', obj.get('patient').get('city'));
                }).then(function (record) {
                    obj.set('city', record);
                    return DS.find('gender', obj.get('patient').get('gender'));
                }).then(function (record) {
                    obj.set('gender', record);
                });
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var patient = _this.get('patient');
                        patient.set('givenName', _this.get('givenName'));
                        patient.set('familyName', _this.get('familyName'));
                        patient.set('postalCode', _this.get('postalCode'));
                        patient.set('phone', _this.get('phone'));
                        patient.set('maritalStatus', _this.get('maritalStatus'));
                        patient.set('occupation', _this.get('occupation'));
                        patient.set('country', _this.get('country').id);
                        patient.set('province', _this.get('province').id);
                        patient.set('city', _this.get('city').id);
                        patient.set('gender', _this.get('gender').id);
                        patient.set('DOB', _this.get('DOB'));
                        patient.save().then(function () {
                            return true;
                        });
                    }
                }).modal('show');
            },
            selectDate: function selectDate(date) {
                this.set('DOB', date);
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
define('front-end/components/modify-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        questionModel: Ember.computed(function () {
            return this.get('store').findAll('question');
        }),
        questionsListsQuestions: [],
        pairModel: [],
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Form' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                var self = this;
                var myStore = this.get('store');

                var questionsListsQuestions = [];
                var questionIds = [];

                this.set('newQuestions', []);
                this.set('questionsCount', 0);

                var form;

                myStore.findRecord('form', this.get('ID'), { reload: true }).then(function (theForm) {
                    form = theForm;
                    for (var i = 0; i < form.get('questionsLists').length; i++) {
                        questionsListsQuestions[form.get('questionsLists')[i]] = 1; // questionsListsQuestions: existing questionsListId's -> 1
                    }
                    self.set('existingQuestionsLists', form.get('questionsLists'));
                    return myStore.findAll('questions-list', { reload: true });
                }).then(function (questionsLists) {
                    questionsLists.forEach(function (questionsList) {
                        if (questionsListsQuestions[questionsList.id]) {
                            var questionsListJSON = JSON.parse(JSON.stringify(questionsList));
                            questionsListJSON.id = questionsList.id;
                            questionsListsQuestions[questionsList.id] = questionsListJSON; // questionsListsQuestions: existing questionsListId's -> questionsList
                            questionIds[questionsListJSON.question] = 1; // questionIds: question id's -> 1
                        }
                    });
                    return myStore.findAll('question', { reload: true });
                }).then(function (questions) {
                    questions.forEach(function (question) {
                        if (questionIds[question.id]) {
                            var questionJSON = JSON.parse(JSON.stringify(question));
                            questionJSON.id = question.id;
                            questionIds[question.id] = questionJSON; // questionIds: question id's -> question
                        }
                    });
                    for (var i = 0; i < self.get('existingQuestionsLists').length; i++) {
                        var obj = questionsListsQuestions[self.get('existingQuestionsLists')[i]];
                        obj.question = questionIds[obj.question];
                        questionsListsQuestions[self.get('existingQuestionsLists')[i]] = obj;
                    }
                    var model = [];
                    for (var i = 0; i < self.get('existingQuestionsLists').length; i++) {
                        model.push(questionsListsQuestions[self.get('existingQuestionsLists')[i]]);
                    }
                    self.set('questionsListsQuestions', model);
                    self.notifyPropertyChange('questionsListsQuestions');
                });

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!_this.get('name')) {
                            alert('Please enter a Name.');
                            return false;
                        }
                        if (!_this.get('description')) {
                            alert('Please enter a Description.');
                            return false;
                        }

                        for (var i = 0; i < _this.get('newQuestions').length; i++) {
                            if (!_this.get('newQuestions')[i].question) {
                                alert('Must select a Question for every new question.');
                                return false;
                            }
                        }

                        form.set('name', self.get('name'));
                        form.set('description', self.get('description'));

                        form.save({ reload: true }).then(function () {
                            var questionsListsToRemove = [];

                            // start by assuming that we'll remove all of the questionsLists of the form
                            for (var i in questionsListsQuestions) {
                                if (questionsListsQuestions.hasOwnProperty(i)) {
                                    questionsListsToRemove.push(i);
                                }
                            }

                            // go through the questionsLists that are still in the modal, and stop them from being removed
                            for (var i = 0; i < self.get('questionsListsQuestions').length; i++) {
                                questionsListsToRemove.splice(questionsListsToRemove.indexOf(self.get('questionsListsQuestions')[i]), 1);
                            }

                            function removeQuestionsLists(index) {
                                if (index < questionsListsToRemove.length) {
                                    myStore.findRecord('questions-list', questionsListsToRemove[index], { reload: true }).then(function (questionsList) {
                                        return questionsList.destroyRecord();
                                    }).then(function () {
                                        return removeQuestionsLists(index + 1);
                                    });
                                } else {}
                            }

                            return removeQuestionsLists(0);
                        }).then(function () {
                            function addQuestionsLists(index) {
                                if (index < self.get('newQuestions').length) {
                                    var newQuestionsList = myStore.createRecord('questions-list', {
                                        form: self.get('ID'),
                                        question: self.get('newQuestions')[index].question
                                    });
                                    newQuestionsList.save({ reload: true }).then(function () {
                                        return addQuestionsLists(index + 1);
                                    });
                                }
                            }

                            return addQuestionsLists(0);
                        }).then(function () {
                            alert('Form saved.');
                        });
                    }
                }).modal('show');
            },
            removeExistingQuestionsList: function removeExistingQuestionsList(questionsList) {
                for (var i = 0; i < this.get('questionsListsQuestions').length; i++) {
                    if (this.get('questionsListsQuestions')[i].id === questionsList.id) {
                        var model = this.get('questionsListsQuestions');
                        model.splice(i, 1);
                        this.set('questionsListsQuestions', model);
                        this.notifyPropertyChange('questionsListsQuestions');
                        return;
                    }
                }
            },
            addQuestion: function addQuestion() {
                var model = this.get('newQuestions');
                var obj = { question: null, id: this.get('questionsCount') };
                this.set('questionsCount', this.get('questionsCount') + 1);
                model.push(obj);
                this.set('newQuestions', model);
                this.notifyPropertyChange('newQuestions');
            },
            removeNewQuestion: function removeNewQuestion(question) {
                var model = this.get('newQuestions');
                model.splice(model.indexOf(question), 1);
                this.set('newQuestions', model);
                this.notifyPropertyChange('newQuestions');
            },
            selectQuestion: function selectQuestion(question, questionId) {
                var model = this.get('newQuestions');
                var index = model.indexOf(question);
                var obj = model[index];
                obj.question = questionId;
                model[index] = obj;
                this.set('newQuestions', model);
                this.notifyPropertyChange('newQuestions');
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
define('front-end/components/modify-physio-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        profileModel: Ember.computed(function () {
            //patientProfile
            return this.get('store').findAll('patientProfile');
        }),
        userAccountModel: Ember.computed(function () {
            //userAccount
            return this.get('store').findAll('user-account');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var obj = this;
                var DS = this.get('DS');
                var physio;
                DS.find('physiotherapist', this.get('ID')).then(function (record) {
                    obj.set('givenName', record.get('givenName'));
                    obj.set('familyName', record.get('familyName'));
                    obj.set('dateFinished', record.get('dateFinished'));
                    physio = record;
                });
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        physio.set('givenName', self.get('givenName'));
                        physio.set('familyName', self.get('familyName'));
                        physio.set('dateFinished', self.get('dateFinished'));
                        physio.save({ reload: true }).then(function () {
                            alert('Physiotherapist Changes Saved.');
                        });
                    }
                }).modal('show');
            },
            selectDateFinished: function selectDateFinished(date) {
                this.set('dateFinished', date);
            },
            didInsertElement: function didInsertElement() {
                /* Init the table and fire off a call to get the hidden nodes. */
                Ember.$(document).ready(function () {
                    var table = Ember.$('#example').DataTable();
                });
            },
            disableAccount: function disableAccount() {
                DS.find('physiotherapist', this.get('ID')).then(function (record) {
                    //record._internalModel._data.isDisabled = true;
                    //console.log(record);
                });
            }
        }
    });
});
define('front-end/components/modify-plan', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        exerciseModel: Ember.computed(function () {
            return this.get('store').findAll('exercise');
        }),
        formModel: Ember.computed(function () {
            return this.get('store').findAll('form');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            addAssessmentTest: function addAssessmentTest() {
                var model = this.get('assessmentTestModel');
                var obj = { name: 'Assessment Test Name ' + this.get('assessmentTestCount').toString(),
                    description: 'Assessment Test Description ' + this.get('assessmentTestCount').toString(),
                    id: this.get('assessmentTestCount') };
                this.set('assessmentTestCount', this.get('assessmentTestCount') + 1);
                var theMap = this.get('assessmentTestMap');
                theMap[obj.id] = null;
                this.set('assessmentTestMap', theMap);
                model.push(obj);
                this.set('assessmentTestModel', model);
                this.notifyPropertyChange('assessmentTestModel');
            },
            addExercisesList: function addExercisesList() {
                var model = this.get('exercisesListModel');
                var obj = { id: this.get('exercisesListCount') };
                this.set('exercisesListCount', this.get('exercisesListCount') + 1);
                var theMap = this.get('exercisesListMap');
                theMap[obj.id] = null;
                this.set('exercisesListMap', theMap);
                model.push(obj);
                this.set('exercisesListModel', model);
                this.notifyPropertyChange('exercisesListModel');
            },
            openModal: function openModal() {
                var _this = this;

                var obj = this;
                var DS = this.get('DS');

                this.set('assessmentTestModel', []);
                this.set('exercisesListModel', []);
                this.set('assessmentTestMap', []); // maps assessmentTests to the form that goes along with them
                this.set('exercisesListMap', []);
                this.set('assessmentTestCount', 0);
                this.set('exercisesListCount', 0);
                this.set('existingAssessmentTests', []);
                this.set('existingExercisesLists', []);

                function findExistingAssessmentTests(index) {
                    if (index !== rehabilitationPlan.get('assessmentTests').length) {
                        DS.findRecord('assessment-test', rehabilitationPlan.get('assessmentTests')[index], { reload: true }).then(function (assessmentTest) {
                            var assessmentTestJSON = JSON.parse(JSON.stringify(assessmentTest));
                            assessmentTestJSON.id = assessmentTest.id;
                            var assessmentTests = obj.get('existingAssessmentTests');
                            assessmentTests.push(assessmentTestJSON);
                            obj.set('existingAssessmentTests', assessmentTests);
                        }).then(function () {
                            findExistingAssessmentTests(index + 1);
                        });
                    } else {
                        findExistingExercisesLists(0);
                    }
                }

                function findExistingExercisesLists(index) {
                    if (index !== rehabilitationPlan.get('exercisesLists').length) {
                        DS.findRecord('exercises-list', rehabilitationPlan.get('exercisesLists')[index], { reload: true }).then(function (exercisesList) {
                            var exercisesListJSON = JSON.parse(JSON.stringify(exercisesList));
                            exercisesListJSON.id = exercisesList.id;
                            var exercisesLists = obj.get('existingExercisesLists');
                            exercisesLists.push(exercisesListJSON);
                            obj.set('existingExercisesLists', exercisesLists);
                            findExistingExercisesLists(index + 1);
                        });
                    } else {
                        findExistingExercises(0);
                    }
                }

                function findExistingExercises(index) {
                    if (index !== obj.get('existingExercisesLists').length) {
                        DS.findRecord('exercise', obj.get('existingExercisesLists')[index].exercise, { reload: true }).then(function (exercise) {
                            var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                            exerciseJSON.id = exercise.id;
                            var theExercisesLists = obj.get('existingExercisesLists');
                            var theExercisesList = theExercisesLists[index];
                            theExercisesList.exercise = exerciseJSON;
                            theExercisesLists[index] = theExercisesList;
                            obj.set('existingExercisesLists', theExercisesLists);
                        }).then(function () {
                            findExistingExercises(index + 1);
                        });
                    } else {
                        obj.notifyPropertyChange('existingAssessmentTests');
                        obj.notifyPropertyChange('existingExercisesLists');
                    }
                }

                var rehabilitationPlan;

                DS.findRecord('rehabilitation-plan', this.get('ID'), { reload: true }).then(function (theRehabilitationPlan) {
                    rehabilitationPlan = theRehabilitationPlan;
                    findExistingAssessmentTests(0);
                });

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        var thisPhysiotherapist = _this.get('physiotherapist');
                        var thisAssessmentTestMap = _this.get('assessmentTestMap');
                        var thisExercisesListMap = _this.get('exercisesListMap');
                        var thisAssessmentTestModel = _this.get('assessmentTestModel');
                        var thisExercisesListModel = _this.get('exercisesListModel');
                        var exerciseIds = [];
                        for (var i = 0; i < thisExercisesListModel.length; i++) {
                            var exerciseId = thisExercisesListMap[thisExercisesListModel[i].id];
                            if (!exerciseId) {
                                alert('Cannot leave any exercises un-selected.');
                                return false;
                            } else {
                                exerciseIds.push(exerciseId);
                            }
                        }
                        var assessmentTestJSONs = [];
                        for (var i = 0; i < thisAssessmentTestModel.length; i++) {
                            var formId = thisAssessmentTestMap[thisAssessmentTestModel[i].id];
                            if (!formId) {
                                alert('Cannot leave any assessment tests un-selected.');
                                return false;
                            } else {
                                var assessmentTestJSON = thisAssessmentTestModel[i];
                                assessmentTestJSON.form = formId;
                                assessmentTestJSONs.push(assessmentTestJSON);
                            }
                        }

                        if (!_this.get('name')) {
                            alert('Name must be non-empty');
                            return false;
                        }

                        for (var i = 0; i < assessmentTestJSONs.length; i++) {
                            if (!assessmentTestJSONs[i].name) {
                                alert('Name must be non-empty for every assessment test.');
                                return false;
                            }
                        }

                        var oldRehabilitationPlan;
                        var oldAssessmentTests;
                        var oldExercisesLists;

                        function updateAssessmentTests(iIndex, jIndex) {
                            if (iIndex !== oldAssessmentTests.length) {
                                if (jIndex !== obj.get('existingAssessmentTests').length) {
                                    if (obj.get('existingAssessmentTests')[jIndex].id === oldAssessmentTests[iIndex]) {
                                        DS.findRecord('assessment-test', oldAssessmentTests[iIndex], { reload: true }).then(function (assessmentTest) {
                                            assessmentTest.set('name', obj.get('existingAssessmentTests')[jIndex].name);
                                            assessmentTest.set('description', obj.get('existingAssessmentTests')[jIndex].description);
                                            assessmentTest.save().then(function () {
                                                updateAssessmentTests(iIndex + 1, 0);
                                            });
                                        });
                                    } else {
                                        updateAssessmentTests(iIndex, jIndex + 1);
                                    }
                                } else {
                                    DS.findRecord('assessment-test', oldAssessmentTests[iIndex], { reload: true }).then(function (assessmentTest) {
                                        assessmentTest.destroyRecord().then(function () {
                                            updateAssessmentTests(iIndex + 1, 0);
                                        });
                                    });
                                }
                            }
                        }

                        function updateExercisesLists(iIndex, jIndex) {
                            if (iIndex !== oldExercisesLists.length) {
                                if (jIndex !== obj.get('existingExercisesLists').length) {
                                    if (obj.get('existingExercisesLists')[jIndex].id === oldExercisesLists[iIndex]) {
                                        updateExercisesLists(iIndex + 1, 0);
                                    } else {
                                        updateExercisesLists(iIndex, jIndex + 1);
                                    }
                                } else {
                                    DS.findRecord('exercises-list', oldExercisesLists[iIndex], { reload: true }).then(function (exercisesList) {
                                        exercisesList.destroyRecord().then(function () {
                                            updateExercisesLists(iIndex + 1, 0);
                                        });
                                    });
                                }
                            }
                        }

                        DS.findRecord('rehabilitation-plan', _this.get('ID'), { reload: true }).then(function (rehabilitationPlan) {
                            oldAssessmentTests = rehabilitationPlan.get('assessmentTests');
                            oldExercisesLists = rehabilitationPlan.get('exercisesLists');

                            oldRehabilitationPlan = rehabilitationPlan;
                            rehabilitationPlan.set('name', obj.get('name'));
                            rehabilitationPlan.set('description', obj.get('description'));
                            rehabilitationPlan.set('goal', obj.get('goal'));
                            rehabilitationPlan.set('timeFrameToComplete', obj.get('timeFrameToComplete'));
                            return rehabilitationPlan.save();
                        }).then(function () {
                            updateAssessmentTests(0, 0);
                        }).then(function () {
                            updateExercisesLists(0, 0);
                        }).then(function () {
                            for (var i = 0; i < exerciseIds.length; i++) {
                                var newExercisesList = DS.createRecord('exercises-list', {
                                    rehabilitationPlan: oldRehabilitationPlan.id,
                                    exercise: exerciseIds[i]
                                });
                                newExercisesList.save();
                            }
                        }).then(function () {
                            for (var i = 0; i < assessmentTestJSONs.length; i++) {
                                var newAssessmentTest = DS.createRecord('assessment-test', {
                                    name: assessmentTestJSONs[i].name,
                                    description: assessmentTestJSONs[i].description,
                                    form: assessmentTestJSONs[i].form,
                                    physiotherapist: thisPhysiotherapist,
                                    rehabilitationPlan: obj.get('ID')
                                });
                                newAssessmentTest.save();
                            }
                        });
                        return true;
                    }
                }).modal('show');
            },
            removeExistingAssessmentTest: function removeExistingAssessmentTest(assessmentTest) {
                var objModel = this.get('existingAssessmentTests');
                var index = objModel.indexOf(assessmentTest);
                objModel.splice(index, 1);
                this.set('existingAssessmentTests', objModel);
                this.notifyPropertyChange('existingAssessmentTests');
            },
            removeAssessmentTest: function removeAssessmentTest(assessmentTest) {
                var objModel = this.get('assessmentTestModel');
                var index = objModel.indexOf(assessmentTest);
                objModel.splice(index, 1);
                this.set('assessmentTestModel', objModel);
                this.notifyPropertyChange('assessmentTestModel');
            },
            removeExistingExercisesList: function removeExistingExercisesList(exercisesList) {
                var objModel = this.get('existingExercisesLists');
                var index = objModel.indexOf(exercisesList);
                objModel.splice(index, 1);
                this.set('existingExercisesLists', objModel);
                this.notifyPropertyChange('existingExercisesLists');
            },
            removeExercisesList: function removeExercisesList(exercisesList) {
                var objModel = this.get('exercisesListModel');
                var index = objModel.indexOf(exercisesList);
                objModel.splice(index, 1);
                this.set('exercisesListModel', objModel);
                this.notifyPropertyChange('exercisesListModel');
            },
            selectDate: function selectDate(date) {
                this.set('timeFrameToComplete', date);
            },
            selectExercise: function selectExercise(exercisesList, exercise) {
                var theMap = this.get('exercisesListMap');
                theMap[exercisesList.id.toString()] = exercise;
                this.set('exercisesListMap', theMap);
            },
            selectForm: function selectForm(assessment, form) {
                var theMap = this.get('assessmentTestMap');
                theMap[assessment.id.toString()] = form;
                this.set('assessmentTestMap', theMap);
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
define('front-end/components/modify-question', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Question' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var _this = this;

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!_this.get('questionText')) {
                            alert('Please enter Question Text.');
                            return false;
                        }
                        if (!_this.get('helpDescription')) {
                            alert('Please enter a Help Description.');
                            return false;
                        }
                        var self = _this;
                        var myStore = self.get('store');

                        myStore.find('question', _this.get('ID')).then(function (question) {
                            question.set('questionText', self.get('questionText'));
                            question.set('helpDescription', self.get('helpDescription'));
                            return question.save();
                        }).then(function () {
                            alert('Question saved.');
                        });
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
define('front-end/components/modify-user', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        profileModel: Ember.computed(function () {
            //patientProfile
            return this.get('store').findAll('patientProfile');
        }),
        userAccountModel: Ember.computed(function () {
            //userAccount
            return this.get('store').findAll('user-account');
        }),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Modify-Posts' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: "fade",
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        return false;
                    }
                }).modal('show');
            },
            selectDateHired: function selectDateHired(date) {
                this.set('dateHired', date);
            },
            selectDateFinished: function selectDateFinished(date) {
                this.set('dateFinished', date);
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
define('front-end/components/new-appointment', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    actions: {
      open: function open(date) {
        // Disable Monday
        //return date.getDay() === 1;
      },
      doSomethingWithSelectedValue: function doSomethingWithSelectedValue(theDate) {
        this.set('time', null);
        var date = new Date(theDate);
        this.set("date", date);

        this.set('times', [9, 10, 11, 13, 14, 15]);

        var obj = this;
        var DS = this.get('DS');
        var appointmentsJSON = [];
        var takenTimes = [];
        DS.findAll('appointment', { reload: true }).then(function (appointments) {
          appointments.forEach(function (appointment) {
            var appointmentJSON = JSON.parse(JSON.stringify(appointment));
            appointmentJSON.id = appointment.id;
            appointmentsJSON.push(appointmentJSON);

            var appointmentDate = new Date(appointmentJSON.date);

            // appointmentDate is on the same day as the selected date
            if (appointmentDate.getFullYear() == date.getFullYear() && appointmentDate.getMonth() == date.getMonth() && appointmentDate.getDate() == date.getDate()) {
              var theTimes = obj.get('times');
              var index = theTimes.indexOf(appointmentDate.getHours()); // index of the matching hour
              // there is a matching hour
              if (index >= 0) {
                theTimes.splice(index, 1); // remove the hour from times
              }
              obj.set('times', theTimes);
            }
          });

          var theTimes = obj.get('times');
          for (var i = 0; i < theTimes.length; i++) {
            if (theTimes[i].toString().length == 1) {
              theTimes[i] = '0' + theTimes[i].toString() + ':30';
            } else {
              theTimes[i] = theTimes[i].toString() + ':30';
            }
          };
          obj.set('times', theTimes);
          obj.notifyPropertyChange('times');
        });
      },
      BookAppointment: function BookAppointment() {
        if (!this.get('date')) {
          alert('Must select a date.');
          return;
        }
        if (!this.get('time')) {
          alert('Must select a time.');
          return;
        }

        var theDate = this.get('date');
        var hours = parseInt(this.get('time').substring(0, 2));
        var minutes = parseInt(this.get('time').substring(3, 5));
        theDate.setHours(hours);
        theDate.setMinutes(minutes);
        var newPost = this.get('DS').createRecord('appointment', {
          date: theDate,
          reason: this.get('reason'),
          other: this.get('other'),
          patientProfile: this.get('oudaAuth').getPerson()
        });
        newPost.save().then(function () {
          alert('Your appointment has been booked!');
        });
        return true;
      }
    }

  });
});
define('front-end/components/pikaday-input', ['exports', 'ember-pikaday/components/pikaday-input'], function (exports, _pikadayInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pikadayInput.default;
});
define('front-end/components/pikaday-inputless', ['exports', 'ember-pikaday/components/pikaday-inputless'], function (exports, _pikadayInputless) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pikadayInputless.default;
    }
  });
});
define('front-end/components/question-dropdown', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        questionsModel: Ember.computed(function () {
            return this.get('store').findAll('question');
        })
    });
});
define('front-end/components/register-admin', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        actions: {
            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');
                var authentication = self.get('oudaAuth');

                self.set('dateHired', null);
                self.set('familyName', null);
                self.set('givenName', null);
                self.set('email1', null);
                self.set('email2', null);
                self.set('userAccountName', null);
                self.set('password1', null);
                self.set('password2', null);

                var newAdministrator;

                Ember.$('.ui.registerAdmin.modal').modal({
                    closable: false,
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('email1') || !self.get('email2')) {
                            alert('Please enter two matching Emails.');
                            return false;
                        }

                        self.set('email1', self.get('email1').toLowerCase());
                        self.set('email2', self.get('email2').toLowerCase());

                        if (self.get('email1') !== self.get('email2')) {
                            alert('Please enter two matching Emails.');
                            return false;
                        }
                        if (!self.get('password1') || self.get('password1') !== self.get('password2')) {
                            alert('Please enter two matching Passwords.');
                            return false;
                        }
                        if (!self.get('userAccountName')) {
                            alert('Please enter a User Account Name.');
                            return false;
                        }
                        self.set('userAccountName', self.get('userAccountName').toLowerCase());
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        if (!self.get('dateHired')) {
                            alert('Please select a Date Hired.');
                            return false;
                        }

                        return myStore.findAll('patientProfile', { reload: true }).then(function (patientProfiles) {
                            patientProfiles.forEach(function (patientProfile) {
                                if (patientProfile.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('physiotherapist', { reload: true });
                        }).then(function (physiotherapists) {
                            physiotherapists.forEach(function (physiotherapist) {
                                if (physiotherapist.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('administrator', { reload: true });
                        }).then(function (administrators) {
                            administrators.forEach(function (administrator) {
                                if (administrator.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('userAccount', { reload: true });
                        }).then(function (userAccounts) {
                            userAccounts.forEach(function (userAccount) {
                                if (userAccount.get('userAccountName').toLowerCase() === self.get('userAccountName').toLowerCase()) {
                                    alert('That User Account Name is already taken.');
                                    throw new Error('That User Account Name is already taken.');
                                }
                            });
                            newAdministrator = myStore.createRecord('administrator', {
                                familyName: self.get('familyName'),
                                givenName: self.get('givenName'),
                                email: self.get('email1'),
                                dateHired: self.get('dateHired')
                            });
                            return newAdministrator.save({ reload: true });
                        }).then(function () {
                            var newUserAccount = myStore.createRecord('userAccount', {
                                userAccountName: self.get('userAccountName'),
                                encryptedPassword: authentication.hash(self.get('password1')),
                                administrator: newAdministrator.id
                            });
                            return newUserAccount.save({ reload: true });
                        }).then(function () {
                            alert('Administrator Created.');
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }).modal('show');
            },
            selectDate: function selectDate(date) {
                this.set('dateHired', date);
            }
        }
    });
});
define('front-end/components/register-physiotherapist', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        actions: {
            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');
                var authentication = self.get('oudaAuth');

                self.set('dateHired', null);
                self.set('familyName', null);
                self.set('givenName', null);
                self.set('email1', null);
                self.set('email2', null);
                self.set('userAccountName', null);
                self.set('password1', null);
                self.set('password2', null);

                var newPhysiotherapist;

                Ember.$('.ui.registerPhysiotherapist.modal').modal({
                    closable: false,
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('email1') || !self.get('email2')) {
                            alert('Please enter two matching Emails.');
                            return false;
                        }

                        self.set('email1', self.get('email1').toLowerCase());
                        self.set('email2', self.get('email2').toLowerCase());

                        if (self.get('email1') !== self.get('email2')) {
                            alert('Please enter two matching Emails.');
                            return false;
                        }
                        if (!self.get('password1') || self.get('password1') !== self.get('password2')) {
                            alert('Please enter two matching Passwords.');
                            return false;
                        }
                        if (!self.get('userAccountName')) {
                            alert('Please enter a User Account Name.');
                            return false;
                        }
                        self.set('userAccountName', self.get('userAccountName').toLowerCase());
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        if (!self.get('dateHired')) {
                            alert('Please select a Date Hired.');
                            return false;
                        }

                        return myStore.findAll('patientProfile', { reload: true }).then(function (patientProfiles) {
                            patientProfiles.forEach(function (patientProfile) {
                                if (patientProfile.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('physiotherapist', { reload: true });
                        }).then(function (physiotherapists) {
                            physiotherapists.forEach(function (physiotherapist) {
                                if (physiotherapist.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('administrator', { reload: true });
                        }).then(function (administrators) {
                            administrators.forEach(function (administrator) {
                                if (administrator.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('userAccount', { reload: true });
                        }).then(function (userAccounts) {
                            userAccounts.forEach(function (userAccount) {
                                if (userAccount.get('userAccountName').toLowerCase() === self.get('userAccountName').toLowerCase()) {
                                    alert('That User Account Name is already taken.');
                                    throw new Error('That User Account Name is already taken.');
                                }
                            });
                            newPhysiotherapist = myStore.createRecord('physiotherapist', {
                                familyName: self.get('familyName'),
                                givenName: self.get('givenName'),
                                email: self.get('email1'),
                                dateHired: self.get('dateHired')
                            });
                            return newPhysiotherapist.save({ reload: true });
                        }).then(function () {
                            var newUserAccount = myStore.createRecord('userAccount', {
                                userAccountName: self.get('userAccountName'),
                                encryptedPassword: authentication.hash(self.get('password1')),
                                physiotherapist: newPhysiotherapist.id
                            });
                            return newUserAccount.save({ reload: true });
                        }).then(function () {
                            alert('Physiotherapist Created.');
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }).modal('show');
            },
            selectDate: function selectDate(date) {
                this.set('dateHired', date);
            }
        }
    });
});
define('front-end/components/register-user', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        genderModel: Ember.computed(function () {
            return this.get('store').findAll('gender');
        }),
        countryModel: Ember.computed(function () {
            return this.get('store').findAll('country');
        }),
        provinceModel: Ember.computed(function () {
            return this.get('store').findAll('province');
        }),
        cityModel: Ember.computed(function () {
            return this.get('store').findAll('city');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');
                var authentication = self.get('oudaAuth');

                self.set('DOB', null);
                self.set('postalCode', null);
                self.set('phone', null);
                self.set('maritalStatus', null);
                self.set('occupation', null);
                self.set('others', null);
                self.set('country', null);
                self.set('province', null);
                self.set('city', null);
                self.set('gender', null);
                self.set('familyName', null);
                self.set('givenName', null);
                self.set('email1', null);
                self.set('email2', null);
                self.set('userAccountName', null);
                self.set('password1', null);
                self.set('password2', null);

                var newPatientProfile;

                Ember.$('.ui.registerUser.modal').modal({
                    closable: false,
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        if (!self.get('email1') || !self.get('email2')) {
                            alert('Please enter two matching Emails.');
                            return false;
                        }

                        self.set('email1', self.get('email1').toLowerCase());
                        self.set('email2', self.get('email2').toLowerCase());

                        if (self.get('email1') !== self.get('email2')) {
                            alert('Please enter two matching Emails.');
                            return false;
                        }
                        if (!self.get('password1') || self.get('password1') !== self.get('password2')) {
                            alert('Please enter two matching Passwords.');
                            return false;
                        }
                        if (!self.get('userAccountName')) {
                            alert('Please enter a User Account Name.');
                            return false;
                        }
                        self.set('userAccountName', self.get('userAccountName').toLowerCase());
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('phone')) {
                            alert('Please enter a Phone Number.');
                            return false;
                        }
                        if (!self.get('givenName')) {
                            alert('Please enter a First Name.');
                            return false;
                        }
                        if (!self.get('familyName')) {
                            alert('Please enter a Last Name.');
                            return false;
                        }
                        if (!self.get('gender')) {
                            alert('Please select a Gender.');
                            return false;
                        }
                        if (!self.get('DOB')) {
                            alert('Please select a Date of Birth.');
                            return false;
                        }
                        if (!self.get('country')) {
                            alert('Please select a Country.');
                            return false;
                        }
                        if (!self.get('province')) {
                            alert('Please select a Province.');
                            return false;
                        }
                        if (!self.get('city')) {
                            alert('Please select a City.');
                            return false;
                        }

                        return myStore.findAll('patientProfile', { reload: true }).then(function (patientProfiles) {
                            patientProfiles.forEach(function (patientProfile) {
                                if (patientProfile.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('physiotherapist', { reload: true });
                        }).then(function (physiotherapists) {
                            physiotherapists.forEach(function (physiotherapist) {
                                if (physiotherapist.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('administrator', { reload: true });
                        }).then(function (administrators) {
                            administrators.forEach(function (administrator) {
                                if (administrator.get('email').toLowerCase() === self.get('email1').toLowerCase()) {
                                    alert('That Email is already taken.');
                                    throw new Error('That Email is already taken.');
                                }
                            });
                            return myStore.findAll('userAccount', { reload: true });
                        }).then(function (userAccounts) {
                            userAccounts.forEach(function (userAccount) {
                                if (userAccount.get('userAccountName').toLowerCase() === self.get('userAccountName').toLowerCase()) {
                                    alert('That User Account Name is already taken.');
                                    throw new Error('That User Account Name is already taken.');
                                }
                            });
                            newPatientProfile = myStore.createRecord('patientProfile', {
                                familyName: self.get('familyName'),
                                givenName: self.get('givenName'),
                                email: self.get('email1'),
                                DOB: self.get('DOB'),
                                phone: self.get('phone'),
                                gender: self.get('gender'),
                                country: self.get('country'),
                                province: self.get('province'),
                                city: self.get('city'),
                                postalCode: self.get('postalCode'),
                                maritalStatus: self.get('maritalStatus'),
                                occupation: self.get('occupation')
                            });
                            return newPatientProfile.save({ reload: true });
                        }).then(function () {
                            var newUserAccount = myStore.createRecord('userAccount', {
                                userAccountName: self.get('userAccountName'),
                                encryptedPassword: authentication.hash(self.get('password1')),
                                patientProfile: newPatientProfile.id
                            });
                            return newUserAccount.save({ reload: true });
                        }).then(function () {
                            alert('Patient Profile Created.');
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }).modal('show');
            },
            selectDate: function selectDate(date) {
                this.set('DOB', date);
            }
        }
    });
});
define('front-end/components/show-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({
        store: Ember.inject.service(),
        DS: Ember.inject.service('store'),
        postsData: null,
        title: Ember.computed.oneWay('postsData.title'),
        body: Ember.computed.oneWay('postsData.body'),
        modalName: Ember.computed(function () {
            return 'Assesment-Test' + this.get('ID');
        }),
        actions: {
            openModal: function openModal() {
                var self = this;
                var myStore = this.get('store');

                Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
                    closable: false,
                    transition: 'fade',
                    onDeny: function onDeny() {
                        return true;
                    },
                    onApprove: function onApprove() {
                        return true;
                    }

                }).modal('show');
            },
            didInsertElement: function didInsertElement() {
                /* Init the table and fire off a call to get the hidden nodes. */
                Ember.$(document).ready(function () {
                    var table = Ember.$('#example').DataTable();
                });
            }
        }

    });
});
define('front-end/components/simple-example', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    DS: Ember.inject.service('store'),
    ImageIsAdding: false,

    model: Ember.computed(function () {
      return this.get('DS').findAll('image');
    }),

    actions: {
      deleteImage: function deleteImage(file) {
        file.destroyRecord();
      },
      addNewImage: function addNewImage() {
        this.set('ImageIsAdding', true);
      }
    }
  });
});
define('front-end/components/stylish-button', ['exports', 'ember-stylish-buttons/components/stylish-button', 'front-end/config/environment'], function (exports, _stylishButton, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var config = _environment.default['ember-stylish-buttons'] || {};

  exports.default = _stylishButton.default.extend({
    type: config.defaultTheme || 'winona'
  });
});
define('front-end/components/to-do-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _EmberComponent$exte;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  exports.default = Ember.Component.extend((_EmberComponent$exte = {
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    newTask: '',
    state: function () {
      return Ember.isEmpty(this.get('newTask'));
    }.property('newTask'),
    isEditing: false
  }, _defineProperty(_EmberComponent$exte, 'state', function () {
    return Ember.isEmpty(this.get('content').get('task'));
  }.property('model.task')), _defineProperty(_EmberComponent$exte, 'completed', function (key, value) {
    var todo = this.get('model');
    var _this = this;
    if (value === undefined) {
      return todo.get('completed');
    } else {
      todo.set('completed', value);
      todo.save().then(function () {
        if (value) {
          _this.notify.info('task ' + todo.get('task') + ' completed');
        }
      });
      return value;
    }
  }.property('model.completed')), _defineProperty(_EmberComponent$exte, 'actions', {
    editTodo: function editTodo() {
      this.set('isEditing', true);
    },
    cancel: function cancel() {
      this.set('isEditing', false);
      this.get('model').rollback();
    },
    updateTodo: function updateTodo() {
      var todo = this.get('content');
      var _this = this;
      todo.save().then(function () {
        _this.notify.info('todo item updated');
        _this.set('isEditing', false);
      });
    },
    addTodo: function addTodo() {
      var DS = this.get('DS');
      var _this = this;
      console.log(_this.get('newTask'));
      var newTask = _this.get('newTask');
      $("ul").append("<li>" + newTask + "</li>");
      // var todo = DS.createRecord('to-do-list', {
      //   task: _this.get('newTask'),
      //   completed: false
      // });
      // todo.save().then(function() {
      //   _this.set('newTask', '');
      //   _this.notify.success('created new task');
      // });
    },
    removeTodo: function removeTodo(todo) {
      todo.destroyRecord();
      this.notify.alert('removed task');
    }
  }), _EmberComponent$exte));
});
define('front-end/components/ui-accordion', ['exports', 'semantic-ui-ember/components/ui-accordion'], function (exports, _uiAccordion) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiAccordion.default;
    }
  });
});
define('front-end/components/ui-checkbox', ['exports', 'semantic-ui-ember/components/ui-checkbox'], function (exports, _uiCheckbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiCheckbox.default;
    }
  });
});
define('front-end/components/ui-dimmer', ['exports', 'semantic-ui-ember/components/ui-dimmer'], function (exports, _uiDimmer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiDimmer.default;
    }
  });
});
define('front-end/components/ui-dropdown', ['exports', 'semantic-ui-ember/components/ui-dropdown'], function (exports, _uiDropdown) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiDropdown.default;
    }
  });
});
define('front-end/components/ui-embed', ['exports', 'semantic-ui-ember/components/ui-embed'], function (exports, _uiEmbed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiEmbed.default;
    }
  });
});
define('front-end/components/ui-modal', ['exports', 'semantic-ui-ember/components/ui-modal'], function (exports, _uiModal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiModal.default;
    }
  });
});
define('front-end/components/ui-nag', ['exports', 'semantic-ui-ember/components/ui-nag'], function (exports, _uiNag) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiNag.default;
    }
  });
});
define('front-end/components/ui-popup', ['exports', 'semantic-ui-ember/components/ui-popup'], function (exports, _uiPopup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiPopup.default;
    }
  });
});
define('front-end/components/ui-progress', ['exports', 'semantic-ui-ember/components/ui-progress'], function (exports, _uiProgress) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiProgress.default;
    }
  });
});
define('front-end/components/ui-radio', ['exports', 'semantic-ui-ember/components/ui-radio'], function (exports, _uiRadio) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiRadio.default;
    }
  });
});
define('front-end/components/ui-rating', ['exports', 'semantic-ui-ember/components/ui-rating'], function (exports, _uiRating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiRating.default;
    }
  });
});
define('front-end/components/ui-search', ['exports', 'semantic-ui-ember/components/ui-search'], function (exports, _uiSearch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiSearch.default;
    }
  });
});
define('front-end/components/ui-shape', ['exports', 'semantic-ui-ember/components/ui-shape'], function (exports, _uiShape) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiShape.default;
    }
  });
});
define('front-end/components/ui-sidebar', ['exports', 'semantic-ui-ember/components/ui-sidebar'], function (exports, _uiSidebar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiSidebar.default;
    }
  });
});
define('front-end/components/ui-sticky', ['exports', 'semantic-ui-ember/components/ui-sticky'], function (exports, _uiSticky) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _uiSticky.default;
    }
  });
});
define('front-end/components/upload-files', ['exports', 'front-end/utils/file-object'], function (exports, _fileObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    model: null,
    flag: null,
    accept: 'audio/*,video/*,image/*',
    multiple: true,
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

      deleteAllFiles: function deleteAllFiles() {
        this.get('queue').clear();
        this.set('flag', false);
      },

      saveFile: function saveFile(file) {
        var _this = this;

        var newFile = this.get('DS').createRecord('image', {
          name: file.name,
          size: file.size,
          type: file.type,
          rawSize: file.rawSize,
          imageData: file.base64Image,
          patientProfile: this.get('oudaAuth').getPerson()
        });
        newFile.save().then(function () {
          _this.get('queue').removeObject(file);

          if (Ember.isEmpty(_this.get('queue'))) {
            _this.set('flag', false);
          }
        });
      },

      saveAllFiles: function saveAllFiles() {
        var _this2 = this;

        this.set('savingInProgress', true);
        var counter = 0;
        this.get('queue').forEach(function (file) {
          if (file.isDisplayableImage) {
            var newFile = _this2.get('DS').createRecord('image', {
              name: file.name,
              size: file.size,
              type: file.type,
              rawSize: file.rawSize,
              imageData: file.base64Image,
              patientProfile: _this2.get('oudaAuth').getPerson()
            });
            newFile.save().then(function () {
              counter++;
              if (_this2.get('queue').length == counter) {
                _this2.get('queue').clear();
                _this2.set('flag', false);
                _this2.set('savingInProgress', false);
              }
            });
          } else {
            counter++;
          }
        });
      },

      done: function done() {
        this.get('queue').clear();
        this.set('flag', false);
      }
    }
  });
});
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
define('front-end/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('front-end/controllers/generate-reports', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    actions: {
      // downLoad: function(){
      //     steps: [
      //       {setFontSize: 40},
      //       {text: [35, 25, 'Tomsters loves jsPDF']}
      //     ]
      // },
      onClick: function onClick(id) {
        console.log(id);
        var pdf = new jsPDF('p', 'pt', 'letter');
        pdf.canvas.height = 72 * 11;
        pdf.canvas.width = 72 * 8.5;

        pdf.fromHTML(document.body);

        pdf.save(id + '.pdf');
      },
      createPDF: function createPDF(givenName, familyName, birthday, email, phone, treatments) {
        var year = parseInt(birthday.slice(0, 4));
        var age = new Date().getFullYear() - year;
        var doc = new jsPDF('p', 'pt', 'letter');
        var lineNum = 0;
        var testresultNum = 0;

        var text1 = 'This is a report for ' + givenName + ' ' + familyName;
        var xOffset1 = doc.internal.pageSize.width / 2 - doc.getStringUnitWidth(text1) * doc.internal.getFontSize() / 2;

        //var text2 = 'Age: ' + new Date().getFullYear() - birthday.getFullYear();
        var text2 = 'Age: ' + age;
        var xOffset2 = 30 + doc.internal.pageSize.width / 2 - doc.getStringUnitWidth(text2) * doc.internal.getFontSize() / 2;

        doc.setFontSize(14);
        doc.setFontStyle('bold');
        doc.text(text1, xOffset1 + 270, 60, null, 0, 'center');

        doc.setFontStyle('underlined');
        doc.text('Client Information: ', xOffset2, 90, null, 0, 'center');

        doc.setFontStyle('italic');
        doc.text(text2, xOffset2, 120, null, 0, 'center');
        doc.text('Email: ' + email, xOffset2, 140, null, 0, 'center');
        doc.text('Phone: ' + phone, xOffset2, 160, null, 0, 'center');
        doc.line(30, 180, 582, 180);
        doc.setFontStyle('underline');
        lineNum = 200;
        doc.text('Treatments: ', xOffset2, lineNum += 20, null, 0, 'center');
        lineNum += 20;
        for (var i = 0; i < treatments.length; i++) {
          doc.setFontStyle('none');
          doc.text(treatments[i].rehabilitationPlan.name, xOffset2, lineNum += 20, null, 0, 'center');
          doc.setFontStyle('italic');
          for (var j = 0; j < treatments[i].rehabilitationPlan.exercisesLists.length; j++) {
            if (lineNum >= 700) {
              doc.addPage();
              lineNum = 20;
            }
            doc.text(treatments[i].rehabilitationPlan.exercisesLists[j].exercise.name, xOffset2, lineNum += 20, null, 0, 'center');
          }
        }

        doc.setFontStyle('none');
        doc.text('Test Results: ', xOffset2, lineNum += 30, null, 0, 'center');
        lineNum += 20;
        doc.setFontStyle('italic');

        for (var i = 0; i < treatments.length; i++) {
          for (var j = 0; j < treatments[i].rehabilitationPlan.assessmentTests.length; j++) {
            for (var k = 0; k < treatments[i].rehabilitationPlan.assessmentTests[j].testResults.length; k++) {
              if (treatments[i].rehabilitationPlan.assessmentTests[j].testResults[k].treatment === treatments[i].id) {
                if (lineNum >= 700) {
                  doc.addPage();
                  lineNum = 20;
                }
                testresultNum += 1;
                doc.text('Question ' + testresultNum.toString() + ': ' + treatments[i].rehabilitationPlan.assessmentTests[j].testResults[k].question, xOffset2, lineNum += 20, null, 0, 'center');
                doc.text('Answer ' + testresultNum.toString() + ': ' + treatments[i].rehabilitationPlan.assessmentTests[j].testResults[k].answer, xOffset2, lineNum += 20, null, 0, 'center');
              }
            }
          }
        }

        doc.setFontStyle('none');
        doc.text('Recommendations: ', xOffset2, lineNum += 30, null, 0, 'center');
        lineNum += 20;
        doc.setFontStyle('italic');

        for (var i = 0; i < treatments.length; i++) {
          for (var j = 0; j < treatments[i].recommendations.length; j++) {
            if (lineNum >= 700) {
              doc.addPage();
              lineNum = 20;
            }
            doc.text(treatments[i].recommendations[j].decision, xOffset2, lineNum += 20, null, 0, 'center');
          }
        }
        doc.output('dataurlnewwindow');
      },
      didInsertElement: function didInsertElement() {
        /* Init the table and fire off a call to get the hidden nodes. */
        $(document).ready(function () {
          var table = $('#example').DataTable();
        });
      }
    }
  });
});
define('front-end/controllers/rehab-plans', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    didInsertElement: function didInsertElement() {
      /* Init the table and fire off a call to get the hidden nodes. */
      $(document).ready(function () {
        var table = $('#example').DataTable();
      });
    }
    // actions:{
    //   didInsertElement: function() {
    //     /* Init the table and fire off a call to get the hidden nodes. */
    //     $(document).ready(function() {
    //         var table = $('#example').DataTable();
    //       } );
    //     }
    //
    // }
  });
});
define('front-end/helpers/app-version', ['exports', 'front-end/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('front-end/helpers/datetime-renderer', ['exports', 'ember-datatables/helpers/datetime-renderer'], function (exports, _datetimeRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _datetimeRenderer.default;
    }
  });
  Object.defineProperty(exports, 'datetimeRenderer', {
    enumerable: true,
    get: function () {
      return _datetimeRenderer.datetimeRenderer;
    }
  });
});
define('front-end/helpers/is-after', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-after'], function (exports, _environment, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isAfter.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/is-before', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-before'], function (exports, _environment, _isBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isBefore.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/is-between', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-between'], function (exports, _environment, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isBetween.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/is-same-or-after', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-same-or-after'], function (exports, _environment, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isSameOrAfter.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/is-same-or-before', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-same-or-before'], function (exports, _environment, _isSameOrBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isSameOrBefore.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/is-same', ['exports', 'front-end/config/environment', 'ember-moment/helpers/is-same'], function (exports, _environment, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isSame.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/map-value', ['exports', 'semantic-ui-ember/helpers/map-value'], function (exports, _mapValue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _mapValue.default;
    }
  });
  Object.defineProperty(exports, 'mapValue', {
    enumerable: true,
    get: function () {
      return _mapValue.mapValue;
    }
  });
});
define('front-end/helpers/moment-add', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-add'], function (exports, _environment, _momentAdd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentAdd.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-calendar', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-calendar'], function (exports, _environment, _momentCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentCalendar.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _momentDuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDuration.default;
    }
  });
});
define('front-end/helpers/moment-format', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _environment, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentFormat.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-from-now', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _environment, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentFromNow.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-from', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-from'], function (exports, _environment, _momentFrom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentFrom.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-subtract', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _environment, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentSubtract.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-to-date', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _environment, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentToDate.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-to-now', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _environment, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentToNow.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-to', ['exports', 'front-end/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _environment, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentTo.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});
define('front-end/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function () {
      return _unix.unix;
    }
  });
});
define('front-end/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _moment.default;
    }
  });
});
define('front-end/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _now) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
});
define('front-end/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('front-end/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('front-end/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function () {
      return _unix.unix;
    }
  });
});
define('front-end/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'front-end/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('front-end/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('front-end/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('front-end/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('front-end/initializers/export-application-global', ['exports', 'front-end/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('front-end/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('front-end/initializers/ouda-auth', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(application) {
    application.inject('route', 'oudaAuth', 'service:ouda-auth'), application.inject('controller', 'oudaAuth', 'service:ouda-auth'), application.inject('component', 'oudaAuth', 'service:ouda-auth');
  }

  exports.default = {
    name: 'ouda-auth',
    initialize: initialize
  };
});
define('front-end/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('front-end/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("front-end/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('front-end/mixins/base', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _base.default;
    }
  });
});
define('front-end/mixins/promise-resolver', ['exports', 'ember-promise-tools/mixins/promise-resolver'], function (exports, _promiseResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _promiseResolver.default;
    }
  });
});
define('front-end/models/administrator', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        familyName: _emberData.default.attr('string'),
        givenName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string'),
        userAccount: _emberData.default.attr('string'),
        dateHired: _emberData.default.attr('date'),
        dateFinished: _emberData.default.attr('date'),
        forms: _emberData.default.attr(),
        enabled: _emberData.default.attr('boolean')
    });
});
define('front-end/models/appointment', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        date: _emberData.default.attr('date'),
        reason: _emberData.default.attr('string'),
        other: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string')
    });
});
define('front-end/models/assessment-test', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        description: _emberData.default.attr('string'),
        form: _emberData.default.attr('string'),
        rehabilitationPlan: _emberData.default.attr('string'),
        recommendations: _emberData.default.attr(),
        testResults: _emberData.default.attr()
    });
});
define('front-end/models/city', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        patientProfiles: _emberData.default.attr()
    });
});
define('front-end/models/completed-injury-form', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        email: _emberData.default.attr('string'),
        date: _emberData.default.attr('date'),
        injuryForm: _emberData.default.attr('string'),
        injuryResults: _emberData.default.attr()
    });
});
define('front-end/models/country', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        patientProfiles: _emberData.default.attr()
    });
});
define('front-end/models/exercise', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        description: _emberData.default.attr('string'),
        objectives: _emberData.default.attr(),
        actionSteps: _emberData.default.attr(),
        frequency: _emberData.default.attr('number'),
        duration: _emberData.default.attr('number'),
        exercisesLists: _emberData.default.attr(),
        image: _emberData.default.attr('string')
    });
});
define('front-end/models/exercises-list', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        rehabilitationPlan: _emberData.default.attr('string'),
        exercise: _emberData.default.attr('string')
    });
});
define('front-end/models/form', ['exports', 'ember-data'], function (exports, _emberData) {
				'use strict';

				Object.defineProperty(exports, "__esModule", {
								value: true
				});
				exports.default = _emberData.default.Model.extend({
								name: _emberData.default.attr('string'),
								description: _emberData.default.attr('string'),
								administrator: _emberData.default.attr('string'),
								assessmentTests: _emberData.default.attr(),
								questionsLists: _emberData.default.attr(),
								injuryForms: _emberData.default.attr()
				});
});
define('front-end/models/gender', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        patientProfiles: _emberData.default.attr()
    });
});
define('front-end/models/image', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr(),
    type: _emberData.default.attr(),
    size: _emberData.default.attr(),
    rawSize: _emberData.default.attr('number'),
    imageData: _emberData.default.attr(),
    patientProfile: _emberData.default.attr('string'),
    exercise: _emberData.default.attr('string')
  });
});
define('front-end/models/injury-form', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        form: _emberData.default.attr('string'),
        completedInjuryForms: _emberData.default.attr()
    });
});
define('front-end/models/injury-result', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        questionText: _emberData.default.attr('string'),
        answer: _emberData.default.attr('string'),
        completedInjuryForm: _emberData.default.attr('string')
    });
});
define('front-end/models/login', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userAccountName: _emberData.default.attr('string'),
        password: _emberData.default.attr('string'),
        nonce: _emberData.default.attr('string'),
        response: _emberData.default.attr('string'),
        token: _emberData.default.attr('string'),
        requestType: _emberData.default.attr('string'),
        wrongUserAccountName: _emberData.default.attr('boolean'),
        wrongPassword: _emberData.default.attr('boolean'),
        passwordMustChanged: _emberData.default.attr('boolean'),
        passwordReset: _emberData.default.attr('boolean'),
        loginFailed: _emberData.default.attr('boolean'),
        accountIsDisabled: _emberData.default.attr('boolean'),
        sessionIsActive: _emberData.default.attr('boolean')
    });
});
define('front-end/models/patient-profile', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        familyName: _emberData.default.attr('string'),
        givenName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string'),
        userAccount: _emberData.default.attr('string'),
        DOB: _emberData.default.attr('date'),
        postalCode: _emberData.default.attr('string'),
        phone: _emberData.default.attr('string'),
        country: _emberData.default.attr('string'),
        province: _emberData.default.attr('string'),
        city: _emberData.default.attr('string'),
        gender: _emberData.default.attr('string'),
        appointments: _emberData.default.attr(),
        treatments: _emberData.default.attr(),
        payments: _emberData.default.attr(),
        images: _emberData.default.attr(),
        enabled: _emberData.default.attr('boolean')
    });
});
define('front-end/models/payment', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        dayTimeStamp: _emberData.default.attr('date'),
        amount: _emberData.default.attr('number'),
        note: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string')
    });
});
define('front-end/models/physiotherapist', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        familyName: _emberData.default.attr('string'),
        givenName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string'),
        userAccount: _emberData.default.attr('string'),
        dateHired: _emberData.default.attr('date'),
        dateFinished: _emberData.default.attr('date'),
        treatments: _emberData.default.attr(),
        rehabilitationPlans: _emberData.default.attr(),
        enabled: _emberData.default.attr('boolean')
    });
});
define('front-end/models/province', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        patientProfiles: _emberData.default.attr()
    });
});
define('front-end/models/question-type', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        questions: _emberData.default.attr()
    });
});
define('front-end/models/question', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        questionText: _emberData.default.attr('string'),
        helpDescription: _emberData.default.attr('string'),
        questionType: _emberData.default.attr(),
        questionsLists: _emberData.default.attr()
    });
});
define('front-end/models/questions-list', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        form: _emberData.default.attr('string'),
        question: _emberData.default.attr('string')
    });
});
define('front-end/models/recommendation', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        timeStamp: _emberData.default.attr('date'),
        decision: _emberData.default.attr('string'),
        assessmentTest: _emberData.default.attr('string'),
        treatment: _emberData.default.attr('string')
    });
});
define('front-end/models/rehabilitation-plan', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        name: _emberData.default.attr('string'),
        description: _emberData.default.attr('string'),
        physiotherapist: _emberData.default.attr('string'),
        goal: _emberData.default.attr('string'),
        exercisesLists: _emberData.default.attr(),
        assessmentTests: _emberData.default.attr(),
        treatments: _emberData.default.attr()
    });
});
define('front-end/models/self-start-user', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        familyName: _emberData.default.attr('string'),
        givenName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string'),
        userAccount: _emberData.default.attr('string')
    });
});
define('front-end/models/test-result', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        question: _emberData.default.attr('string'),
        answer: _emberData.default.attr('string'),
        assessmentTest: _emberData.default.attr('string'),
        treatment: _emberData.default.attr('string')
    });
});
define('front-end/models/to-do-list', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    task: _emberData.default.attr('string'),
    completed: _emberData.default.attr('boolean', { defaultValue: false })
  });
});
define('front-end/models/treatment', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        dateAssigned: _emberData.default.attr('string'),
        physiotherapist: _emberData.default.attr('string'),
        rehabilitationPlan: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string'),
        recommendations: _emberData.default.attr(),
        testResutls: _emberData.default.attr()
    });
});
define('front-end/models/user-account', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userAccountName: _emberData.default.attr('string'),
        encryptedPassword: _emberData.default.attr('string'),
        administrator: _emberData.default.attr('string'),
        physiotherapist: _emberData.default.attr('string'),
        patientProfile: _emberData.default.attr('string'),
        encryptedAuth: _emberData.default.attr('string'),
        authenticationCode: _emberData.default.attr('string'),
        passwordMustChanged: _emberData.default.attr('boolean'),
        salt: _emberData.default.attr('string')
    });
});
define('front-end/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('front-end/router', ['exports', 'front-end/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('clients');
    this.route('exercise');
    this.route('forms');
    this.route('home', { path: '/' });
    this.route('login');
    this.route('manage-users');
    this.route('questions');
    this.route('rehab-plans');
    this.route('book-appointment');
    this.route('patient-profiles');
    this.route('make-payment');
    this.route('assessment-tests');
    this.route('about');
    this.route('blog');
    this.route('faq');
    this.route('how-it-works');
    this.route('services');
    this.route('log-out');
    this.route('create-accounts');
    this.route('admin');
    this.route('generate-reports');
    this.route('injury-forms');
    this.route('fill-injury-form');
    this.route('treatments');
    this.route('admin-profile');
    this.route('physio-profile');
    this.route('my-images');
    this.route('patient-images');
    this.route('physio-completed-injury-forms');
    this.route('appointments');
  });

  exports.default = Router;
});
define('front-end/routes/about', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('front-end/routes/admin-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ad') {
                this.transitionTo('home');
            }
        },
        model: function model() {
            var self = this;
            var adminJSON;
            return this.get('store').findRecord('administrator', this.get('oudaAuth').getPerson(), { reload: true }).then(function (admin) {
                adminJSON = JSON.parse(JSON.stringify(admin));
                adminJSON.id = admin.id;
                adminJSON.dateHired = new Date(adminJSON.dateHired);
                return self.get('store').findRecord('userAccount', adminJSON.userAccount, { reload: true });
            }).then(function (userAccount) {
                var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
                userAccountJSON.id = userAccount.id;
                adminJSON.userAccount = userAccountJSON;
                return adminJSON;
            });
        }
    });
});
define('front-end/routes/admin', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      var DS = this.store;
      var adminJSON = [];
      var obj = this;
      var userCount = 0;
      var physioCount = 0;
      return DS.findAll('patientProfile').then(function (patients) {
        patients.forEach(function (patients) {
          userCount++;
        });
        adminJSON.push(userCount);
        return obj.store.findAll('physiotherapist');
      }).then(function (physio) {
        physio.forEach(function (physio) {
          physioCount++;
        });
        adminJSON.push(physioCount);
        //     return obj.store.findAll('assessment-test');
        //   }).then(function(assessmentTest){
        //     assessmentTest.forEach(function(assessmentTest){
        //       //console.log(at);
        //       //console.log(formsJSON);
        //       for (var i = 0; i <formsJSON.length; i++){
        //         for(var j = 0; j <formsJSON[i].assessmentTests.length; j++){
        //           if (formsJSON[i].assessmentTests[j] == assessmentTest.id){
        //             formsJSON[i].assessmentTests[j] = assessmentTest._internalModel._data.name;
        //               //console.log(formsJSON[i].assessmentTests[j]);
        //           }
        //         }
        //       }
        //     });
        //       return obj.store.findAll('question');
        //     }).then(function(question){
        //       question.forEach(function(question){
        //         console.log(question);
        //         console.log(formsJSON);
        //         for (var i = 0; i <formsJSON.length; i++){
        //           for(var j = 0; j <formsJSON[i].questionsLists.length; j++){
        //             if (formsJSON[i].questionsLists[j] == question.id){
        //                formsJSON[i].questionsLists[j] = question._internalModel._data.questionText;
        //
        //               //doesnt get here
        //                console.log(formsJSON[i].questionsLists[j]);
        //              }
        //           }
        //         }
        //       });
        console.log(adminJSON);
        return adminJSON;
      });
    },

    model2: function model2() {
      return this.store.find('to-do-list');
    }
  });
});
define('front-end/routes/application', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            var authentication = this.get('oudaAuth');
            authentication.set('isLoginRequested', false);
            var self = this;

            if (!localStorage.getItem('sas-session-id')) {
                this.get('router').transitionTo('home');
                return;
            }
            authentication.fetch().then(function (res) {
                self.get('router').transitionTo('home');
            }).catch(function (err) {
                self.get('router').transitionTo('home');
            });
        }
    });
});
define('front-end/routes/appointments', ['exports', 'front-end/utils/file-object'], function (exports, _fileObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ph') {
        this.transitionTo('home');
      }
    },
    model: function model() {
      var authentication = this.get('oudaAuth');
      var myStore = this.get('store');
      var appointmentsJSON = [];
      var patientProfilesMap = [];
      return myStore.findAll('appointment', { reload: true }).then(function (appointments) {
        appointments.forEach(function (appointment) {
          var appointmentJSON = JSON.parse(JSON.stringify(appointment));
          appointmentJSON.id = appointment.id;
          var now = new Date();
          var then = new Date(appointmentJSON.date);
          if (then > now) {
            appointmentJSON.date = then;
            appointmentsJSON.push(appointmentJSON);
            patientProfilesMap[appointmentJSON.patientProfile] = 1;
          }
        });
        return myStore.findAll('patient-profile', { reload: true });
      }).then(function (patientProfiles) {
        patientProfiles.forEach(function (patientProfile) {
          if (patientProfilesMap[patientProfile.id]) {
            var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
            patientProfileJSON.id = patientProfile.id;
            patientProfilesMap[patientProfile.id] = patientProfileJSON;
          }
        });
        for (var i = 0; i < appointmentsJSON.length; i++) {
          appointmentsJSON[i].patientProfile = patientProfilesMap[appointmentsJSON[i].patientProfile];
        }
        console.log(appointmentsJSON);
        return appointmentsJSON;
      }).catch(function (err) {
        alert(err);
      });
    }
  });
});
define('front-end/routes/assessment-tests', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {
            var DS = this.store;
            var assessmentTestJSON = [];
            var obj = this;
            return DS.findAll('assessment-test').then(function (at) {
                at.forEach(function (at) {
                    var assessmentTestsJSON = JSON.parse(JSON.stringify(at));
                    assessmentTestsJSON.id = at.id;
                    assessmentTestJSON.push(assessmentTestsJSON);
                });
                return obj.store.findAll('form');
            }).then(function (form) {
                form.forEach(function (form) {
                    for (var i = 0; i < assessmentTestJSON.length; i++) {
                        if (assessmentTestJSON[i].form == form.id) {
                            assessmentTestJSON[i].form = form._internalModel._data.name;
                        }
                    }
                });
                //return obj.store.findAll('physiotherapist');
                // }).then(function(physiotherapist){
                //   physiotherapist.forEach(function(physiotherapist){
                //     for (var i = 0; i <assessmentTestJSON.length; i++){
                //
                //         if (assessmentTestJSON[i].physiotherapist == physiotherapist.id){
                //           assessmentTestJSON[i].physiotherapist_fname = physiotherapist._internalModel._data.givenName;
                //           assessmentTestJSON[i].physiotherapist_lname = physiotherapist._internalModel._data.familyName;
                //       }
                //     }
                //  });
                return assessmentTestJSON;
            });
        }
    });
});
define('front-end/routes/blog', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('front-end/routes/book-appointment', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'pa') {
                this.get('router').transitionTo('home');
            }
        },
        model: function model() {
            return this.store.findAll('appointment');
        }
    });
});
define('front-end/routes/clients', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend({
		router: Ember.inject.service(),
		beforeModel: function beforeModel() {
			if (this.get('oudaAuth').getRole() !== 'pa') {
				this.get('router').transitionTo('home');
			}
		},
		model: function model() {
			var self = this;
			var myStore = this.get('store');

			var patientJSON;

			return myStore.findRecord('patient-profile', this.get('oudaAuth').getPerson(), { reload: true }).then(function (patient) {
				patientJSON = JSON.parse(JSON.stringify(patient));
				patientJSON.id = patient.id;

				return myStore.findRecord('gender', patientJSON.gender, { reload: true });
			}).then(function (gender) {
				var genderJSON = JSON.parse(JSON.stringify(gender));
				genderJSON.id = gender.id;
				patientJSON.gender = genderJSON;
				return myStore.findRecord('country', patientJSON.country, { reload: true });
			}).then(function (country) {
				var countryJSON = JSON.parse(JSON.stringify(country));
				countryJSON.id = country.id;
				patientJSON.country = countryJSON;
				return myStore.findRecord('province', patientJSON.province, { reload: true });
			}).then(function (province) {
				var provinceJSON = JSON.parse(JSON.stringify(province));
				provinceJSON.id = province.id;
				patientJSON.province = provinceJSON;
				return myStore.findRecord('city', patientJSON.city, { reload: true });
			}).then(function (city) {
				var cityJSON = JSON.parse(JSON.stringify(city));
				cityJSON.id = city.id;
				patientJSON.city = cityJSON;
				return patientJSON;
			});
		}
	});
});
define('front-end/routes/exercise', ['exports', 'front-end/utils/file-object'], function (exports, _fileObject) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ph') {
                this.transitionTo('home');
            }
        },
        model: function model() {
            var authentication = this.get('oudaAuth');
            var myStore = this.get('store');
            var exercisesJSON = [];
            return myStore.findAll('exercise', { reload: true }).then(function (exercises) {
                exercises.forEach(function (exercise) {
                    var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                    exerciseJSON.id = exercise.id;
                    exercisesJSON.push(exerciseJSON);
                });
            }).then(function () {
                function findImages(index) {
                    if (index !== exercisesJSON.length) {
                        return myStore.findRecord('image', exercisesJSON[index].image, { reload: true }).then(function (image) {
                            var imageJSON = JSON.parse(JSON.stringify(image));
                            imageJSON.id = image.id;
                            exercisesJSON[index].image = imageJSON;
                            return findImages(index + 1);
                        });
                    } else {
                        return exercisesJSON;
                    }
                }

                return findImages(0);
            }).catch(function (err) {
                alert(err);
            });
        }
    });
});
define('front-end/routes/faq', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('front-end/routes/fill-injury-form', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        model: function model() {
            var injuryFormsJSON = [];
            var self = this;
            var myStore = this.get('store');

            return myStore.findAll('injury-form').then(function (injuryForms) {
                injuryForms.forEach(function (injuryForm) {
                    var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                    injuryFormJSON.id = injuryForm.id;
                    injuryFormsJSON.push(injuryFormJSON);
                });
                return myStore.findAll('form', { reload: true });
            }).then(function (forms) {
                forms.forEach(function (form) {
                    for (var i = 0; i < injuryFormsJSON.length; i++) {
                        if (injuryFormsJSON[i].form === form.id) {
                            var formJSON = JSON.parse(JSON.stringify(form));
                            formJSON.id = form.id;
                            injuryFormsJSON[i].form = formJSON;
                        }
                    }
                });
                return injuryFormsJSON;
            });
        }
    });
});
define('front-end/routes/forms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ad') {
        this.get('router').transitionTo('home');
      }
    },
    model: function model() {
      var self = this;
      var myStore = this.get('store');
      var formsJSON = [];
      var adminMap = [];
      var self = this;
      return myStore.findAll('form').then(function (forms) {
        forms.forEach(function (form) {
          var formJSON = JSON.parse(JSON.stringify(form));
          formJSON.id = form.id;
          formsJSON.push(formJSON);
        });
        return myStore.findAll('administrator');
      }).then(function (admins) {
        admins.forEach(function (admin) {
          var adminJSON = JSON.parse(JSON.stringify(admin));
          adminJSON.id = admin.id;
          adminMap[admin.id] = adminJSON;
        });
        for (var i = 0; i < formsJSON.length; i++) {
          formsJSON[i].administrator = adminMap[formsJSON[i].administrator];
        }
        return formsJSON;
      });
    }
  });
});
define('front-end/routes/generate-reports', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    model: function model() {
      var self = this;
      var myStore = this.get('store');

      var patientProfilesJSON = [];

      var userAccountsMap = [];
      var treatmentsMap = [];
      var rehabilitationPlansMap = [];
      var exercisesListsMap = [];
      var exercisesMap = [];
      var assessmentTestsMap = [];
      var testResultsMap = [];
      var recommendationsMap = [];

      return myStore.findAll('patient-profile', { reload: true }).then(function (patientProfiles) {
        patientProfiles.forEach(function (patientProfile) {
          var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
          patientProfileJSON.id = patientProfile.id;
          patientProfilesJSON.push(patientProfileJSON);
          userAccountsMap[patientProfileJSON.userAccount] = 1;
          for (var i = 0; i < patientProfileJSON.treatments.length; i++) {
            treatmentsMap[patientProfileJSON.treatments[i]] = 1;
          }
        });
        return myStore.findAll('user-account', { reload: true });
      }).then(function (userAccounts) {
        userAccounts.forEach(function (userAccount) {
          if (userAccountsMap[userAccount.id]) {
            var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
            userAccountJSON.id = userAccount.id;
            userAccountsMap[userAccount.id] = userAccountJSON;
          }
        });
        return myStore.findAll('treatment', { reload: true });
      }).then(function (treatments) {
        treatments.forEach(function (treatment) {
          if (treatmentsMap[treatment.id]) {
            var treatmentJSON = JSON.parse(JSON.stringify(treatment));
            treatmentJSON.id = treatment.id;
            treatmentsMap[treatment.id] = treatmentJSON;
            rehabilitationPlansMap[treatmentJSON.rehabilitationPlan] = 1;
            for (var i = 0; i < treatmentJSON.recommendations.length; i++) {
              recommendationsMap[treatmentJSON.recommendations[i]] = 1;
            }
          }
        });
        return myStore.findAll('rehabilitation-plan', { reload: true });
      }).then(function (rehabilitationPlans) {
        rehabilitationPlans.forEach(function (rehabilitationPlan) {
          if (rehabilitationPlansMap[rehabilitationPlan.id]) {
            var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
            rehabilitationPlanJSON.id = rehabilitationPlan.id;
            rehabilitationPlansMap[rehabilitationPlan.id] = rehabilitationPlanJSON;
            for (var i = 0; i < rehabilitationPlanJSON.exercisesLists.length; i++) {
              exercisesListsMap[rehabilitationPlanJSON.exercisesLists[i]] = 1;
            }
            for (var i = 0; i < rehabilitationPlanJSON.assessmentTests.length; i++) {
              assessmentTestsMap[rehabilitationPlanJSON.assessmentTests[i]] = 1;
            }
          }
        });
        return myStore.findAll('exercises-list', { reload: true });
      }).then(function (exercisesLists) {
        exercisesLists.forEach(function (exercisesList) {
          if (exercisesListsMap[exercisesList.id]) {
            var exercisesListJSON = JSON.parse(JSON.stringify(exercisesList));
            exercisesListJSON.id = exercisesList.id;
            exercisesListsMap[exercisesList.id] = exercisesListJSON;
            exercisesMap[exercisesListJSON.exercise] = 1;
          }
        });
        return myStore.findAll('exercise', { reload: true });
      }).then(function (exercises) {
        exercises.forEach(function (exercise) {
          if (exercisesMap[exercise.id]) {
            var exerciseJSON = JSON.parse(JSON.stringify(exercise));
            exerciseJSON.id = exercise.id;
            exercisesMap[exercise.id] = exerciseJSON;
          }
        });
        return myStore.findAll('assessment-test', { reload: true });
      }).then(function (assessmentTests) {
        assessmentTests.forEach(function (assessmentTest) {
          if (assessmentTestsMap[assessmentTest.id]) {
            var assessmentTestJSON = JSON.parse(JSON.stringify(assessmentTest));
            assessmentTestJSON.id = assessmentTest.id;
            assessmentTestsMap[assessmentTest.id] = assessmentTestJSON;
            for (var i = 0; i < assessmentTestJSON.testResults.length; i++) {
              testResultsMap[assessmentTestJSON.testResults[i]] = 1;
            }
            for (var i = 0; i < assessmentTestJSON.recommendations.length; i++) {
              recommendationsMap[assessmentTestJSON.recommendations[i]] = 1;
            }
          }
        });
        return myStore.findAll('test-result', { reload: true });
      }).then(function (testResults) {
        testResults.forEach(function (testResult) {
          if (testResultsMap[testResult.id]) {
            var testResultJSON = JSON.parse(JSON.stringify(testResult));
            testResultJSON.id = testResult.id;
            testResultsMap[testResult.id] = testResultJSON;
          }
        });
        return myStore.findAll('recommendation', { reload: true });
      }).then(function (recommendations) {
        recommendations.forEach(function (recommendation) {
          if (recommendationsMap[recommendation.id]) {
            var recommendationJSON = JSON.parse(JSON.stringify(recommendation));
            recommendationJSON.id = recommendation.id;
            recommendationsMap[recommendation.id] = recommendationJSON;
          }
        });
        for (var key in assessmentTestsMap) {
          if (assessmentTestsMap.hasOwnProperty(key)) {
            for (var i = 0; i < assessmentTestsMap[key].testResults.length; i++) {
              assessmentTestsMap[key].testResults[i] = testResultsMap[assessmentTestsMap[key].testResults[i]];
            }
            for (var i = 0; i < assessmentTestsMap[key].recommendations.length; i++) {
              assessmentTestsMap[key].recommendations[i] = recommendationsMap[assessmentTestsMap[key].recommendations[i]];
            }
            assessmentTestsMap[key].rehabilitationPlan = rehabilitationPlansMap[assessmentTestsMap[key].rehabilitationPlan];
          }
        }
        for (var key in exercisesListsMap) {
          if (exercisesListsMap.hasOwnProperty(key)) {
            exercisesListsMap[key].exercise = exercisesMap[exercisesListsMap[key].exercise];
          }
        }
        for (var key in rehabilitationPlansMap) {
          if (rehabilitationPlansMap.hasOwnProperty(key)) {
            for (var i = 0; i < rehabilitationPlansMap[key].exercisesLists.length; i++) {
              rehabilitationPlansMap[key].exercisesLists[i] = exercisesListsMap[rehabilitationPlansMap[key].exercisesLists[i]];
            }
            for (var i = 0; i < rehabilitationPlansMap[key].assessmentTests.length; i++) {
              rehabilitationPlansMap[key].assessmentTests[i] = assessmentTestsMap[rehabilitationPlansMap[key].assessmentTests[i]];
            }
          }
        }
        for (var key in treatmentsMap) {
          if (treatmentsMap.hasOwnProperty(key)) {
            treatmentsMap[key].rehabilitationPlan = rehabilitationPlansMap[treatmentsMap[key].rehabilitationPlan];
            for (var i = 0; i < treatmentsMap[key].recommendations.length; i++) {
              treatmentsMap[key].recommendations[i] = recommendationsMap[treatmentsMap[key].recommendations[i]];
            }
          }
        }
        for (var i = 0; i < patientProfilesJSON.length; i++) {
          patientProfilesJSON[i].userAccount = userAccountsMap[patientProfilesJSON[i].userAccount];
          for (var j = 0; j < patientProfilesJSON[i].treatments.length; j++) {
            patientProfilesJSON[i].treatments[j] = treatmentsMap[patientProfilesJSON[i].treatments[j]];
          }
        }
        console.log('patientProfilesJSON:');
        console.log(patientProfilesJSON);
        return patientProfilesJSON;
      });
    }
  });
});
define('front-end/routes/home', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('front-end/routes/how-it-works', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('front-end/routes/injury-forms', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ad') {
                this.get('router').transitionTo('home');
            }
        },
        model: function model() {
            var self = this;
            var myStore = this.get('store');

            var injuryFormsJSON = [];
            var formMap = [];
            return myStore.findAll('injuryForm', { reload: true }).then(function (injuryForms) {
                injuryForms.forEach(function (injuryForm) {
                    var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                    injuryFormJSON.id = injuryForm.id;
                    injuryFormsJSON.push(injuryFormJSON);
                });
                return myStore.findAll('form', { reload: true });
            }).then(function (forms) {
                forms.forEach(function (form) {
                    var formJSON = JSON.parse(JSON.stringify(form));
                    formJSON.id = form.id;
                    formMap[form.id] = formJSON;
                });
                for (var i = 0; i < injuryFormsJSON.length; i++) {
                    injuryFormsJSON[i].form = formMap[injuryFormsJSON[i].form];
                }
                return injuryFormsJSON;
            });
        }
    });
});
define('front-end/routes/log-out', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            var authentication = this.get('oudaAuth');
            if (authentication.userCList) {
                var identity = localStorage.getItem('sas-session-id');
                var name = authentication.decrypt(identity);
                authentication.close(name);
            }
        }
    });
});
define('front-end/routes/login', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').get('isAuthenticated')) {
                this.get('router').transitionTo('application');
            }
        },
        model: function model() {
            return this.store.findAll('user-account');
        }
    });
});
define('front-end/routes/make-payment', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'pa') {
                this.get('router').transitionTo('home');
            }
        }
    });
});
define('front-end/routes/manage-users', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    DS: Ember.inject.service('store'),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ad') {
        this.get('router').transitionTo('home');
      }
    },
    model: function model() {
      var self = this;
      var myStore = this.get('store');
      var patientProfilesJSON = [];
      var physiotherapistsJSON = [];

      var userAccountsJSON = [];

      var patientProfilesMap = [];
      var physiotherapistsMap = [];

      return this.store.findAll('userAccount', { reload: true }).then(function (userAccounts) {
        userAccounts.forEach(function (userAccount) {
          var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
          userAccountJSON.id = userAccount.id;
          userAccountJSON.role = {};
          if (userAccountJSON.patientProfile) {
            userAccountJSON.role.isPatientProfile = true;
            userAccountJSON.role.isPhysiotherapist = false;
            userAccountsJSON.push(userAccountJSON);
            patientProfilesMap[userAccountJSON.patientProfile] = 1;
          } else if (userAccountJSON.physiotherapist) {
            userAccountJSON.role.isPatientProfile = false;
            userAccountJSON.role.isPhysiotherapist = true;
            userAccountsJSON.push(userAccountJSON);
            physiotherapistsMap[userAccountJSON.physiotherapist] = 1;
          }
          console.log('userAccountsJSON:');
          console.log(userAccountsJSON);
        });
        return self.store.findAll('patient-profile', { reload: true });
      }).then(function (patientProfiles) {
        patientProfiles.forEach(function (patientProfile) {
          var patientProfileJSON = JSON.parse(JSON.stringify(patientProfile));
          patientProfileJSON.id = patientProfile.id;
          patientProfilesMap[patientProfile.id] = patientProfileJSON;
        });
        return self.store.findAll('physiotherapist', { reload: true });
      }).then(function (physiotherapists) {
        physiotherapists.forEach(function (physiotherapist) {
          var physiotherapistJSON = JSON.parse(JSON.stringify(physiotherapist));
          physiotherapistJSON.id = physiotherapist.id;
          physiotherapistsMap[physiotherapist.id] = physiotherapistJSON;
        });
        for (var i = 0; i < userAccountsJSON.length; i++) {
          console.log(i);
          if (userAccountsJSON[i].patientProfile) {
            userAccountsJSON[i].patientProfile = patientProfilesMap[userAccountsJSON[i].patientProfile];
          } else {
            userAccountsJSON[i].physiotherapist = physiotherapistsMap[userAccountsJSON[i].physiotherapist];
          }
        }
        return userAccountsJSON;
      });
    },

    actions: {
      enableUser: function enableUser(ID) {
        var self = this;
        var myStore = this.get('store');

        var patientProfile;
        myStore.findRecord('patient-profile', ID, { reload: true }).then(function (thePatientProfile) {
          patientProfile = thePatientProfile;
          if (patientProfile.get('enabled')) {
            console.log('ORIGINALLY ENABLED');
            patientProfile.set('enabled', false);
          } else {
            console.log('ORIGINALLY DISABLED');
            patientProfile.set('enabled', true);
          }
          return patientProfile.save({ reload: true });
        }).then(function () {
          if (patientProfile.get('enabled')) {
            alert('Patient Enabled.');
          } else {
            alert('Patient Disabled.');
          }
        });
      },
      enablePhysio: function enablePhysio(ID) {
        var self = this;
        var myStore = this.get('store');

        var physiotherapist;
        myStore.findRecord('physiotherapist', ID, { reload: true }).then(function (thePhysiotherapist) {
          physiotherapist = thePhysiotherapist;
          physiotherapist.set('enabled', !physiotherapist.get('enabled'));
          return physiotherapist.save({ reload: true });
        }).then(function () {
          if (physiotherapist.get('enabled')) {
            alert('Physiotherapist Enabled.');
          } else {
            alert('Physiotherapist Disabled.');
          }
        });
      }
    }
  });
});
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
define('front-end/routes/patient-images', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ph') {
        this.transitionTo('home');
      }
    },
    model: function model() {
      var authentication = this.get('oudaAuth');
      var myStore = this.get('store');
      var patientProfilesJSON = [];
      return myStore.findAll('patient-profile', { reload: true });
    }
  });
});
define('front-end/routes/patient-profiles', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ph') {
                this.get('router').transitionTo('home');
            }
        },
        model: function model() {
            return this.get('store').findAll('patient-profile', { reload: true });
        }
    });
});
define('front-end/routes/physio-completed-injury-forms', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        model: function model() {
            var self = this;
            var myStore = this.get('store');

            var completedInjuryFormsJSON = [];
            var injuryResultsMap = [];
            var injuryFormsMap = [];

            return myStore.findAll('completed-injury-form', { reload: true }).then(function (completedInjuryForms) {
                completedInjuryForms.forEach(function (completedInjuryForm) {
                    var completedInjuryFormJSON = JSON.parse(JSON.stringify(completedInjuryForm));
                    completedInjuryFormJSON.id = completedInjuryForm.id;
                    completedInjuryFormsJSON.push(completedInjuryFormJSON);
                    for (var i = 0; i < completedInjuryFormJSON.injuryResults.length; i++) {
                        injuryResultsMap[completedInjuryFormJSON.injuryResults[i]] = 1;
                    }
                    injuryFormsMap[completedInjuryFormJSON.injuryForm] = 1;
                });
                return myStore.findAll('injuryResult', { reload: true });
            }).then(function (injuryResults) {
                injuryResults.forEach(function (injuryResult) {
                    if (injuryResultsMap[injuryResult.id]) {
                        var injuryResultJSON = JSON.parse(JSON.stringify(injuryResult));
                        injuryResultJSON.id = injuryResult.id;
                        injuryResultsMap[injuryResult.id] = injuryResultJSON;
                    }
                });
                for (var i = 0; i < completedInjuryFormsJSON.length; i++) {
                    for (var j = 0; j < completedInjuryFormsJSON[i].injuryResults.length; j++) {
                        completedInjuryFormsJSON[i].injuryResults[j] = injuryResultsMap[completedInjuryFormsJSON[i].injuryResults[j]];
                    }
                }
                return myStore.findAll('injury-form', { reload: true });
            }).then(function (injuryForms) {
                injuryForms.forEach(function (injuryForm) {
                    if (injuryFormsMap[injuryForm.id]) {
                        var injuryFormJSON = JSON.parse(JSON.stringify(injuryForm));
                        injuryFormJSON.id = injuryForm.id;
                        injuryFormsMap[injuryForm.id] = injuryFormJSON;
                    }
                });
                for (var i = 0; i < completedInjuryFormsJSON.length; i++) {
                    completedInjuryFormsJSON[i].injuryForm = injuryFormsMap[completedInjuryFormsJSON[i].injuryForm];
                }
                return completedInjuryFormsJSON;
            });
        },

        actions: {
            removeCompletedInjuryForm: function removeCompletedInjuryForm(id) {
                this.get('store').find('completed-injury-form', id, { reload: true }).then(function (completedInjuryForm) {
                    return completedInjuryForm.destroyRecord();
                }).then(function () {
                    alert('Completed Injury Form Deleted.');
                });
            }
        }
    });
});
define('front-end/routes/physio-profile', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ph') {
                this.transitionTo('home');
            }
        },
        model: function model() {
            var self = this;
            var physioJSON;
            return this.get('store').findRecord('physiotherapist', this.get('oudaAuth').getPerson(), { reload: true }).then(function (physio) {
                physioJSON = JSON.parse(JSON.stringify(physio));
                physioJSON.id = physio.id;
                physioJSON.dateHired = new Date(physioJSON.dateHired);
                return self.get('store').findRecord('userAccount', physioJSON.userAccount, { reload: true });
            }).then(function (userAccount) {
                var userAccountJSON = JSON.parse(JSON.stringify(userAccount));
                userAccountJSON.id = userAccount.id;
                physioJSON.userAccount = userAccountJSON;
                return physioJSON;
            });
        }
    });
});
define('front-end/routes/questions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    store: Ember.inject.service(),
    router: Ember.inject.service(),
    beforeModel: function beforeModel() {
      if (this.get('oudaAuth').getRole() !== 'ad') {
        this.get('router').transitionTo('home');
      }
    },
    model: function model() {
      var questionPairs = [];
      var DS = this.store;
      var questionsJSON = [];
      var self = this;
      var myStore = this.get('store');
      return DS.findAll('question').then(function (questions) {
        questions.forEach(function (question) {
          var questionJSON = JSON.parse(JSON.stringify(question));
          questionJSON.id = question.id;
          questionsJSON.push(questionJSON);
        });
        return myStore.findAll('question-type');
      }).then(function (questiontype) {
        questiontype.forEach(function (questiontype) {
          //console.log(questiontype)
          for (var i = 0; i < questionsJSON.length; i++) {
            if (questionsJSON[i].questionType === questiontype.id) {
              questionsJSON[i].questionType = questiontype._internalModel._data.name;
            }
          }
        });
        return questionsJSON;
      });
    }
  });
});
define('front-end/routes/rehab-plans', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        router: Ember.inject.service(),
        beforeModel: function beforeModel() {
            if (this.get('oudaAuth').getRole() !== 'ph') {
                this.get('router').transitionTo('home');
            }
        },
        model: function model() {
            var authentication = this.get('oudaAuth');
            var rehabilitationPlansJSON = [];
            return this.store.findAll('rehabilitation-plan').then(function (rehabilitationPlans) {
                rehabilitationPlans.forEach(function (rehabilitationPlan) {
                    var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                    rehabilitationPlanJSON.id = rehabilitationPlan.id;
                    if (rehabilitationPlanJSON.physiotherapist === authentication.getPerson()) {
                        rehabilitationPlansJSON.push(rehabilitationPlanJSON);
                    }
                });
                return rehabilitationPlansJSON;
            });
        }
    });
});
define('front-end/routes/services', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('front-end/routes/treatments', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        store: Ember.inject.service(),
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

            var treatmentsJSON = [];

            var treatmentsMap = []; // treatment id's -> treatment
            var rehabilitationPlansMap = []; // rehabilitationPlan id's -> rehabilitationPlan
            var assessmentTestsMap = []; // assessmentTest id's -> assessmentTest
            var formsMap = []; // form id's -> form
            var questionsListsMap = []; // questionsList id's -> questionsList
            var questionsMap = []; // question id's -> questions
            var questionTypesMap = []; // questionType id's -> questionTypes
            var exercisesListsMap = []; // exercisesList id's -> exercisesLists
            var exercisesMap = []; // exercises id's -> exercises
            var imagesMap = []; // image id's -> images

            return myStore.findAll('treatment', { reload: true }).then(function (treatments) {
                treatments.forEach(function (treatment) {
                    if (treatment.get('patientProfile') === authentication.getPerson()) {
                        var treatmentJSON = JSON.parse(JSON.stringify(treatment));
                        treatmentJSON.id = treatment.id;
                        treatmentsMap[treatmentJSON.id] = treatmentJSON;
                        rehabilitationPlansMap[treatmentJSON.rehabilitationPlan] = 1;
                    }
                });
                return myStore.findAll('rehabilitation-plan', { reload: true });
            }).then(function (rehabilitationPlans) {
                rehabilitationPlans.forEach(function (rehabilitationPlan) {
                    if (rehabilitationPlansMap[rehabilitationPlan.id]) {
                        var rehabilitationPlanJSON = JSON.parse(JSON.stringify(rehabilitationPlan));
                        rehabilitationPlanJSON.id = rehabilitationPlan.id;
                        rehabilitationPlansMap[rehabilitationPlan.id] = rehabilitationPlanJSON;
                        for (var i = 0; i < rehabilitationPlanJSON.assessmentTests.length; i++) {
                            assessmentTestsMap[rehabilitationPlanJSON.assessmentTests[i]] = 1;
                        }
                        for (var i = 0; i < rehabilitationPlanJSON.exercisesLists.length; i++) {
                            exercisesListsMap[rehabilitationPlanJSON.exercisesLists[i]] = 1;
                        }
                    }
                });
                return myStore.findAll('assessment-test', { reload: true });
            }).then(function (assessmentTests) {
                assessmentTests.forEach(function (assessmentTest) {
                    if (assessmentTestsMap[assessmentTest.id]) {
                        var assessmentTestJSON = JSON.parse(JSON.stringify(assessmentTest));
                        assessmentTestJSON.id = assessmentTest.id;
                        assessmentTestsMap[assessmentTest.id] = assessmentTestJSON;
                        formsMap[assessmentTestJSON.form] = 1;
                    }
                });
                return myStore.findAll('form', { reload: true });
            }).then(function (forms) {
                forms.forEach(function (form) {
                    if (formsMap[form.id]) {
                        var formJSON = JSON.parse(JSON.stringify(form));
                        formJSON.id = form.id;
                        formsMap[form.id] = formJSON;
                        for (var i = 0; i < formJSON.questionsLists.length; i++) {
                            questionsListsMap[formJSON.questionsLists[i]] = 1;
                        }
                    }
                });
                return myStore.findAll('questions-list', { reload: true });
            }).then(function (questionsLists) {
                questionsLists.forEach(function (questionsList) {
                    if (questionsListsMap[questionsList.id]) {
                        var questionsListJSON = JSON.parse(JSON.stringify(questionsList));
                        questionsListJSON.id = questionsList.id;
                        questionsListsMap[questionsList.id] = questionsListJSON;
                        questionsMap[questionsListJSON.question] = 1;
                    }
                });
                return myStore.findAll('question', { reload: true });
            }).then(function (questions) {
                questions.forEach(function (question) {
                    if (questionsMap[question.id]) {
                        var questionJSON = JSON.parse(JSON.stringify(question));
                        questionJSON.id = question.id;
                        questionsMap[question.id] = questionJSON;
                        questionTypesMap[questionJSON.questionType] = 1;
                    }
                });
                return myStore.findAll('question-type', { reload: true });
            }).then(function (questionTypes) {
                questionTypes.forEach(function (questionType) {
                    if (questionTypesMap[questionType.id]) {
                        var questionTypeJSON = JSON.parse(JSON.stringify(questionType));
                        questionTypeJSON.id = questionType.id;
                        questionTypesMap[questionType.id] = questionTypeJSON;
                    }
                });
                return myStore.findAll('exercises-list', { reload: true });
            }).then(function (exercisesLists) {
                exercisesLists.forEach(function (exercisesList) {
                    if (exercisesListsMap[exercisesList.id]) {
                        var exercisesListJSON = JSON.parse(JSON.stringify(exercisesList));
                        exercisesListJSON.id = exercisesList.id;
                        exercisesListsMap[exercisesList.id] = exercisesListJSON;
                        exercisesMap[exercisesListJSON.exercise] = 1;
                    }
                });
                return myStore.findAll('exercise', { reload: true });
            }).then(function (exercises) {
                exercises.forEach(function (exercise) {
                    if (exercisesMap[exercise.id]) {
                        var exerciseJSON = JSON.parse(JSON.stringify(exercise));
                        exerciseJSON.id = exercise.id;
                        exercisesMap[exercise.id] = exerciseJSON;
                        imagesMap[exerciseJSON.image] = 1;
                    }
                });
                return myStore.findAll('image', { reload: true });
            }).then(function (images) {
                images.forEach(function (image) {
                    if (imagesMap[image.id]) {
                        var imageJSON = JSON.parse(JSON.stringify(image));
                        imageJSON.id = image.id;
                        imagesMap[image.id] = imageJSON;
                    }
                });
                var replacement = [];
                for (var key in questionTypesMap) {
                    if (questionTypesMap.hasOwnProperty(key)) {
                        for (var i = 0; i < questionTypesMap[key].questions.length; i++) {
                            questionTypesMap[key].questions[i] = questionsMap[questionTypesMap[key].questions[i]];
                        }
                    }
                }
                for (var key in questionsMap) {
                    if (questionsMap.hasOwnProperty(key)) {
                        questionsMap[key].questionType = questionTypesMap[questionsMap[key].questionType];
                        for (var i = 0; i < questionsMap[key].questionsLists.length; i++) {
                            questionsMap[key].questionsLists[i] = questionsListsMap[questionsMap[key].questionsLists[i]];
                        }
                    }
                }
                for (var key in questionsListsMap) {
                    if (questionsListsMap.hasOwnProperty(key)) {
                        questionsListsMap[key].question = questionsMap[questionsListsMap[key].question];
                        questionsListsMap[key].form = formsMap[questionsListsMap[key].form];
                    }
                }
                for (var key in formsMap) {
                    if (formsMap.hasOwnProperty(key)) {
                        for (var i = 0; i < formsMap[key].questionsLists.length; i++) {
                            formsMap[key].questionsLists[i] = questionsListsMap[formsMap[key].questionsLists[i]];
                        }
                        for (var i = 0; i < formsMap[key].assessmentTests.length; i++) {
                            formsMap[key].assessmentTests[i] = assessmentTestsMap[formsMap[key].assessmentTests[i]];
                        }
                    }
                }
                for (var key in assessmentTestsMap) {
                    if (assessmentTestsMap.hasOwnProperty(key)) {
                        assessmentTestsMap[key].form = formsMap[assessmentTestsMap[key].form];
                        assessmentTestsMap[key].rehabilitationPlan = rehabilitationPlansMap[assessmentTestsMap[key].rehabilitationPlan];
                    }
                }
                for (var key in rehabilitationPlansMap) {
                    if (rehabilitationPlansMap.hasOwnProperty(key)) {
                        for (var i = 0; i < rehabilitationPlansMap[key].assessmentTests.length; i++) {
                            rehabilitationPlansMap[key].assessmentTests[i] = assessmentTestsMap[rehabilitationPlansMap[key].assessmentTests[i]];
                        }
                        for (var i = 0; i < rehabilitationPlansMap[key].exercisesLists.length; i++) {
                            rehabilitationPlansMap[key].exercisesLists[i] = exercisesListsMap[rehabilitationPlansMap[key].exercisesLists[i]];
                        }
                        for (var i = 0; i < rehabilitationPlansMap[key].treatments.length; i++) {
                            rehabilitationPlansMap[key].treatments[i] = treatmentsMap[rehabilitationPlansMap[key].treatments[i]];
                        }
                    }
                }
                for (var key in exercisesListsMap) {
                    if (exercisesListsMap.hasOwnProperty(key)) {
                        exercisesListsMap[key].rehabilitationPlan = rehabilitationPlansMap[exercisesListsMap[key].rehabilitationPlan];
                        exercisesListsMap[key].exercise = exercisesMap[exercisesListsMap[key].exercise];
                    }
                }
                for (var key in exercisesMap) {
                    if (exercisesMap.hasOwnProperty(key)) {
                        exercisesMap[key].image = imagesMap[exercisesMap[key].image];
                        for (var i = 0; i < exercisesMap[key].exercisesLists.length; i++) {
                            exercisesMap[key].exercisesLists[i] = exercisesListsMap[exercisesMap[key].exercisesLists[i]];
                        }
                    }
                }
                for (var key in imagesMap) {
                    if (imagesMap.hasOwnProperty(key)) {
                        imagesMap[key].exercise = exercisesMap[imagesMap[key].exercise];
                    }
                }
                for (var key in treatmentsMap) {
                    if (treatmentsMap.hasOwnProperty(key)) {
                        treatmentsMap[key].rehabilitationPlan = rehabilitationPlansMap[treatmentsMap[key].rehabilitationPlan];
                        treatmentsJSON.push(treatmentsMap[key]);
                    }
                }
                return treatmentsJSON;
            });
        }
    });
});
define('front-end/serializers/application', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.RESTSerializer.extend({
    primaryKey: '_id'
  });
});
define('front-end/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('front-end/services/moment', ['exports', 'front-end/config/environment', 'ember-moment/services/moment'], function (exports, _environment, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _moment.default.extend({
    defaultFormat: Ember.get(_environment.default, 'moment.outputFormat')
  });
});
define('front-end/services/ouda-auth', ['exports', 'npm:crypto-browserify'], function (exports, _npmCryptoBrowserify) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    router: Ember.inject.service(),
    key: 'SE3350b Winter 2016',
    userAccountName: null,
    encryptedPassword: null,
    isAuthenticated: false,
    store: Ember.inject.service(),
    isLoginRequested: false,
    userCList: null,
    isAdmin: false,
    isPhysiotherapist: false,
    isPatient: false,
    getRole: function getRole() {
      if (this.get('userCList')) {
        return this.get('userCList').substring(0, 2);
      } else {
        return null;
      }
    },
    getPerson: function getPerson() {
      if (this.get('userCList')) {
        return this.get('userCList').substring(2, 26);
      } else {
        return null;
      }
    },
    getUserAccount: function getUserAccount() {
      if (this.get('userCList')) {
        return this.get('userCList').substring(26, 50);
      } else {
        return null;
      }
    },

    getName: Ember.computed(function () {
      var identity = localStorage.getItem('sas-session-id');
      if (identity) {
        return this.decrypt(identity);
      } else {
        return null;
      }
    }),
    setName: function setName(name) {
      this.set('userAccountName', name.toLowerCase());
      var identity = this.encrypt(this.get('userAccountName'));
      localStorage.setItem('sas-session-id', identity);
    },
    setPassword: function setPassword(password) {
      this.set('encryptedPassword', this.hash(password));
    },
    hash: function hash(text) {
      var hash = _npmCryptoBrowserify.default.createHash('sha256');
      hash.update(text);
      return hash.digest('binary');
    },
    encrypt: function encrypt(plainText) {
      var cipher = _npmCryptoBrowserify.default.createCipher('aes256', 'SE3350b Winter 2016');
      var crypted = cipher.update(plainText, 'ascii', 'binary');
      crypted += cipher.final('binary');
      return crypted;
    },
    decrypt: function decrypt(cipherText) {
      if (!cipherText) {
        return '';
      }
      var decipher = _npmCryptoBrowserify.default.createDecipher('aes256', this.get('key'));
      var dec = decipher.update(cipherText, 'binary', 'ascii');
      dec += decipher.final('ascii');
      return dec;
    },
    open: function open(name, password) {
      var self = this;
      var myStore = self.get('store');

      var loginRequest = myStore.createRecord('login', {
        userAccountName: name,
        password: null,
        nonce: null,
        response: null,
        token: null,
        requestType: 'open',
        wrongUserAccountName: null,
        wrongPassword: null,
        passwordMustChanged: null,
        passwordReset: null,
        loginFailed: null,
        accountIsDisabeld: null,
        sessionIsActive: null
      });
      return loginRequest.save().then(function (serverResponse) {
        console.log('serverResponse:');
        console.log(JSON.stringify(serverResponse));
        if (serverResponse.get('loginFailed')) {
          self.close(name);
          throw new Error('Login failed...');
        } else if (serverResponse.get('wrongUserAccountName')) {
          throw new Error('User Account Name does not exist.');
        } else if (serverResponse.get('accountIsDisabled')) {
          console.log('Account is disabled.');
          throw new Error('Your account is disabled.');
        } else {
          var NONCE = self.encrypt(serverResponse.get('nonce'));
          self.set('encryptedPassword', self.hash(password));
          var clientResponse = myStore.createRecord('login', {
            userAccountName: name,
            password: self.get('encryptedPassword'),
            nonce: null,
            response: NONCE,
            token: null,
            requestType: 'openResponse',
            wrongUserAccountName: null,
            wrongPassword: null,
            passwordMustChanged: null,
            passwordReset: null,
            loginFailed: null,
            accountIsDisabled: null,
            sessionIsActive: null
          });

          return clientResponse.save().then(function (serverResponse2) {
            if (serverResponse2.get('loginFailed')) {
              throw new Error('Login failed...');
            } else if (serverResponse2.get('wrongPassword')) {
              throw new Error('Incorrect Password.');
            } else if (serverResponse2.get('passwordReset')) {
              throw new Error('Your password must be reset.');
            } else {
              self.setName(name);
              var userRole = self.decrypt(serverResponse2.get('token'));
              self.set('isAuthenticated', true);
              self.set('userCList', userRole);
              if (self.getRole() === 'ad') {
                self.set('isPhysiotherapist', false);
                self.set('isPatient', false);
                self.set('isAdmin', true);
              } else if (self.getRole() === 'ph') {
                self.set('isAdmin', false);
                self.set('isPatient', false);
                self.set('isPhysiotherapist', true);
              } else {
                self.set('isAdmin', false);
                self.set('isPhysiotherapist', false);
                self.set('isPatient', true);
              }
            }
          });
        }
      });
    },
    fetch: function fetch() {
      var self = this;
      var identity = localStorage.getItem('sas-session-id');
      if (identity) {
        var name = self.decrypt(identity);
        self.set('userAccountName', name);
        var myStore = self.get('store');
        var fetchRequest = myStore.createRecord('login', {
          userAccountName: name,
          password: null,
          nonce: null,
          response: null,
          requestType: 'fetch'
        });
        return fetchRequest.save().then(function (serverResponse) {
          if (serverResponse.get('loginFailed')) {
            self.close(name);
            throw new Error('fetchFailed');
          } else {
            var NONCE = self.encrypt(serverResponse.get('nonce'));
            var clientResponse = myStore.createRecord('login', {
              userAccountName: name,
              password: null,
              nonce: null,
              response: NONCE,
              requestType: 'fetchResponse'
            });
            return clientResponse.save();
          }
        }).then(function (givenToken) {
          if (givenToken.get('loginFailed')) {
            self.close(name);
            throw new Error('fetchFailed');
          } else {
            var plainToken = self.decrypt(givenToken.get('token'));
            self.set('isAuthenticated', true);
            self.set('userCList', plainToken);
            if (self.getRole() === 'ad') {
              self.set('isPhysiotherapist', false);
              self.set('isPatient', false);
              self.set('isAdmin', true);
            } else if (self.getRole() === 'ph') {
              self.set('isAdmin', false);
              self.set('isPatient', false);
              self.set('isPhysiotherapist', true);
            } else {
              self.set('isAdmin', false);
              self.set('isPhysiotherapist', false);
              self.set('isPatient', true);
            }
            return plainToken;
          }
        });
      } else {
        throw new Error('userNotActive');
      }
    },
    close: function close(user) {
      var self = this;
      var myStore = this.get('store');

      window.localStorage.setItem('sas-session-id', '');
      this.set('userCList', null);
      this.set('getName', null);
      this.set('userAccountName', null);
      this.set('encryptedPassword', null);
      this.set('isAuthenticated', false);
      this.set('isLoginRequested', false);
      this.set('isAdmin', false);
      this.set('isPhysiotherapist', false);
      this.set('isPatient', false);

      myStore.findAll('login', { reload: true }).then(function (logins) {
        logins.forEach(function (record) {
          if (record.get('userAccountName') === user) {
            record.destroyRecord();
          }
        });
        self.get('router').transitionTo('home');
      });
    }
  });
});
define("front-end/templates/about", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "098yBDHY", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"body\"],[9,\"style\",\"margin-left:4em; margin-right:4em\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"About Stephanie\"],[8],[0,\"\\n        As a physiotherapist, Stephanie Marcotte has dedicated herself to helping others discover a\\n        pain-free life by tapping into the power of their own body. Now, to help reach more people,\\n        Stephanie has developed a unique online platform that allows her to share her expertise in a\\n        convenient, effective, and personalized way.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      With over three decades of professional experience, Stephanie inspires her clients to move towards\\n      a better life, giving them the tools they need to feel better. Stephanie has studied and\\n      observed thousands of bodies in injury and pain over the years. When in pain, whether physical\\n      or emotional - we stop moving. The body bears the burdens in life, both mentally\\n      and physically.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      A keen observer of how the human body moves and works as a whole, Stephanie is dedicated to\\n      helping others discover the ease of living a pain-free life.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      \"],[6,\"b\"],[7],[0,\"Her treatment method is simple: A little way with a little movement.\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      By utilizing movement from within your own body, Stephanie will help you return to a state of\\n      well-being. Her custom-tailored work, which uses simple movement patterns without any force,\\n      reminds your body of its proper design function.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      Once you start moving again, you’ll be inspired to keep going.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      A leader in the self-care movement, Stephanie’s expertise in the field of pain relief will give you\\n      the knowledge and confidence you need to step into a better life.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      Through individualized consultation sessions, Stephanie works alongside you to help you\\n      achieve your best health. She believes that your body knows how to heal itself and that you already\\n      have everything you need to feel better about your body and your life.\"],[6,\"br\"],[7],[8],[0,\"\\n      A little way with a little movement really will help you enjoy a life you never thought possible.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      \"],[6,\"b\"],[7],[0,\"\\n        Discover how Stephanie can help you today!\\n      \"],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/about.hbs" } });
});
define("front-end/templates/admin-profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "b5AlLuMH", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"admin-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"forms\"],null,{\"statements\":[[0,\"Forms Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"questions\"],null,{\"statements\":[[0,\"Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"injury-forms\"],null,{\"statements\":[[0,\"Injury Forms\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"manage-users\"],null,{\"statements\":[[0,\"Manage Users\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em; margin-right: 4em\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[1,[20,[\"model\",\"givenName\"]],false],[0,\" \"],[1,[20,[\"model\",\"familyName\"]],false],[8],[0,\"\\n    \"],[6,\"h4\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n    \"],[1,[20,[\"model\",\"userAccount\",\"userAccountName\"]],false],[0,\"\\n    \"],[6,\"h4\"],[7],[0,\"Email\"],[8],[0,\"\\n    \"],[1,[20,[\"model\",\"email\"]],false],[0,\"\\n    \"],[6,\"h4\"],[7],[0,\"Date Hired\"],[8],[0,\"\\n    \"],[1,[20,[\"model\",\"dateHired\"]],false],[0,\"\\n    \"],[6,\"br\"],[7],[8],[0,\"\\n    \"],[1,[25,\"modify-admin-profile\",null,[[\"ID\"],[[20,[\"model\",\"id\"]]]]],false],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/admin-profile.hbs" } });
});
define("front-end/templates/admin", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "7x1sz1IL", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"forms\"],null,{\"statements\":[[0,\"Forms Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"questions\"],null,{\"statements\":[[0,\"Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"manage-users\"],null,{\"statements\":[[0,\"Manage Users\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"admin\"],null,{\"statements\":[[0,\"Admin Dashboard\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em;\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Admin Dashboard\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row jqur\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-12\"],[9,\"style\",\"margin-left: 6em; margin-top: 30px;\"],[7],[0,\"\\n      \"],[6,\"b\"],[9,\"style\",\"padding-left: 39px;\"],[7],[0,\"Clients: \"],[8],[0,\"\\n      \"],[6,\"b\"],[9,\"style\",\"padding-left:110px;\"],[7],[0,\" Physiotherapists: \"],[8],[0,\"\\n      \"],[6,\"b\"],[9,\"style\",\"padding-left:77px;\"],[7],[0,\"Pending Payments: \"],[8],[0,\"\\n      \"],[6,\"div\"],[7],[0,\"\\n      \"],[6,\"br\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"counter\"],[10,\"data-count\",[20,[\"model\",\"0\"]],null],[7],[0,\"0\"],[8],[0,\"\\n\\n          \"],[6,\"div\"],[9,\"class\",\"counter\"],[10,\"data-count\",[20,[\"model\",\"1\"]],null],[7],[0,\"0\"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"counter\"],[10,\"data-count\",[20,[\"model\",\"1\"]],null],[7],[0,\"0\"],[8],[0,\"\\n\\n              \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"ui positive button\"],[9,\"style\",\"padding-left: 122px;border: #4f9ec7; background-color: white; color: #4f9ec7\"],[7],[0,\"\\n            \"],[6,\"a\"],[9,\"href\",\"#services\"],[7],[0,\"\\n               See Monthly\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"ui positive button\"],[9,\"style\",\"padding-left:86px;background-color: white; color: #4f9ec7\"],[7],[0,\"\\n            \"],[6,\"a\"],[9,\"href\",\"#services\"],[7],[0,\"\\n               See Monthly\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"ui positive button\"],[9,\"style\",\"padding-left:99px;background-color: white; color: #4f9ec7\"],[7],[0,\"\\n            \"],[6,\"a\"],[9,\"href\",\"#services\"],[7],[0,\"\\n               See Monthly\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\\n\\n\\n  \"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\\n\"],[1,[18,\"to-do-list\"],false],[0,\"\\n\\n\"],[6,\"script\"],[7],[0,\"\\n\\n$('.counter').each(function() {\\n  var $this = $(this),\\n      countTo = $this.attr('data-count');\\n\\n  $({ countNum: $this.text()}).animate({\\n    countNum: countTo\\n  },\\n\\n  {\\n    duration: 1500,\\n    easing:'linear',\\n    step: function() {\\n      $this.text(Math.floor(this.countNum));\\n    },\\n    complete: function() {\\n      $this.text(this.countNum);\\n    }\\n  });\\n});\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/admin.hbs" } });
});
define("front-end/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qC3ogk1H", "block": "{\"symbols\":[],\"statements\":[[6,\"head\"],[7],[0,\"\\n  \"],[6,\"link\"],[9,\"href\",\"https://fonts.googleapis.com/css?family=Kaushan+Script\"],[9,\"rel\",\"stylesheet\"],[7],[8],[0,\"\\n  \"],[6,\"link\"],[9,\"href\",\"https://fonts.googleapis.com/css?family=Amita\"],[9,\"rel\",\"stylesheet\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"nav\"],[9,\"id\",\"mainNav\"],[9,\"style\",\"background-color: white; padding-top:4em\"],[7],[0,\"\\n\\n  \"],[4,\"link-to\",[\"home\"],null,{\"statements\":[[6,\"img\"],[9,\"class\",\"navbar-brand\"],[9,\"style\",\"padding:0 8em 0 4em; margin-top:-2em;margin-right: 5em; height: 90px\"],[9,\"src\",\"assets/images/SelfStart+logo+small.png\"],[7],[8]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"oudaAuth\",\"isAuthenticated\"]]],null,{\"statements\":[[0,\"    \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top: 8px\"],[7],[4,\"link-to\",[\"log-out\"],null,{\"statements\":[[0,\"Logout\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"Login\"]],\"parameters\":[]},null],[8],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"fill-injury-form\"],null,{\"statements\":[[0,\"Fill Injury Form\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"parameters\":[]}],[4,\"if\",[[20,[\"oudaAuth\",\"isPhysiotherapist\"]]],null,{\"statements\":[[0,\"    \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Physiotherapist\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[],\"parameters\":[]}],[4,\"if\",[[20,[\"oudaAuth\",\"isAdmin\"]]],null,{\"statements\":[[0,\"    \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"admin-profile\"],null,{\"statements\":[[0,\"Admin\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[],\"parameters\":[]}],[4,\"if\",[[20,[\"oudaAuth\",\"isPatient\"]]],null,{\"statements\":[[0,\"    \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Client\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[],\"parameters\":[]}],[0,\"  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"blog\"],null,{\"statements\":[[0,\"Blog\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"href\",\"/#contact\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[0,\"Contact\"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"faq\"],null,{\"statements\":[[0,\"FAQ\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"services\"],null,{\"statements\":[[0,\"Services\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"how-it-works\"],null,{\"statements\":[[0,\"Online Therapy\"],[6,\"br\"],[7],[8],[0,\"How It Works\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"about\"],null,{\"statements\":[[0,\"About Me\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"nav-link\"],[9,\"style\",\"float: right; padding-right: 4em; padding-top:8px\"],[7],[4,\"link-to\",[\"home\"],null,{\"statements\":[[0,\"Home\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[1,[18,\"outlet\"],false],[0,\"\\n\"],[6,\"footer\"],[9,\"style\",\"text-align:center; padding-top: 2em; padding-bottom: 2em\"],[7],[0,\"\\n  \"],[6,\"a\"],[9,\"href\",\"https://www.facebook.com/Marcotte-Physiotherapy-Clinic-345984852492140/\"],[9,\"target\",\"_blank\"],[7],[6,\"i\"],[9,\"class\",\"large facebook icon\"],[7],[8],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"href\",\"https://www.linkedin.com/in/stephanie-marcotte-258985149/\"],[9,\"target\",\"_blank\"],[7],[6,\"i\"],[9,\"class\",\"large linkedin in icon\"],[7],[8],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/application.hbs" } });
});
define("front-end/templates/appointments", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "fVDMatRF", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"Appointments\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Time\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Reason\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Time\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Reason\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"patientProfile\",\"givenName\"]],false],[0,\" \"],[1,[19,1,[\"patientProfile\",\"familyName\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"date\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"reason\"]],false],[0,\" \"],[1,[18,\"appt-button\"],false],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/appointments.hbs" } });
});
define("front-end/templates/assessment-tests", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "kZljFF11", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"script\"],[7],[0,\"\\n $(document).ready(function() {\\n        var table = $('#example').DataTable();\\n      }\\n  );\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Create a Plan\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"assessment-tests\"],null,{\"statements\":[[0,\"Complete Assessment Test\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Assesment Tests\"],[8],[0,\"\\n    \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[2,\" <th>Form</th> \"],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Complete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[2,\" <th>Form</th> \"],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Complete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n                \"],[2,\" <td>{{onePost.form}}</td> \"],[0,\"\\n\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[25,\"complete-test\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/assessment-tests.hbs" } });
});
define("front-end/templates/blog", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nymZxqET", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"body\"],[9,\"style\",\"margin-left: 4em\"],[7],[0,\"\\n\"],[6,\"h2\"],[7],[0,\"Blog\"],[8],[0,\"\\n  \"],[6,\"h1\"],[9,\"style\",\"font-family: Kaushan Script; font-size: 30px\"],[7],[0,\"Coming Soon!\"],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"p\"],[9,\"style\",\"font-size: 20px\"],[7],[0,\"I am preparing topics for my blog, which is almost ready!\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/blog.hbs" } });
});
define("front-end/templates/book-appointment", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zjtHJguU", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"book-appointment\"],null,{\"statements\":[[0,\"Book Appointment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"make-payment\"],null,{\"statements\":[[0,\"Make Payment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"treatments\"],null,{\"statements\":[[0,\"Treatments\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"my-images\"],null,{\"statements\":[[0,\"My Uploaded Images\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[1,[18,\"new-appointment\"],false],[0,\"\\n\"],[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/book-appointment.hbs" } });
});
define("front-end/templates/clients", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "bxwl808m", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"book-appointment\"],null,{\"statements\":[[0,\"Book Appointment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"make-payment\"],null,{\"statements\":[[0,\"Make Payment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"treatments\"],null,{\"statements\":[[0,\"Treatments\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"my-images\"],null,{\"statements\":[[0,\"My Uploaded Images\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em; margin-right: 4em\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[1,[20,[\"model\",\"givenName\"]],false],[0,\" \"],[1,[20,[\"model\",\"familyName\"]],false],[8],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"userAccount\",\"userAccountName\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Email\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"email\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Date of Birth\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"DOB\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Postal Code\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"postalCode\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Phone Number\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"phone\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Gender\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"gender\",\"name\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Country\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"country\",\"name\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"Province\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"province\",\"name\"]],false],[0,\"\\n  \"],[6,\"h4\"],[7],[0,\"City\"],[8],[0,\"\\n  \"],[1,[20,[\"model\",\"city\",\"name\"]],false],[0,\"\\n  \"],[6,\"br\"],[7],[8],[0,\"\\n  \"],[1,[25,\"modify-client-profile\",null,[[\"ID\"],[[20,[\"model\",\"id\"]]]]],false],[0,\"\\n  \"],[6,\"br\"],[7],[8],[0,\"\\n  \"],[1,[18,\"upload-files\"],false],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"h3\"],[7],[0,\"How to Create a Movement Assessment Video\"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"style\",\"position: relative; width: 640px;\"],[7],[0,\"\\n\\n    \"],[6,\"video\"],[9,\"id\",\"0\"],[9,\"controls\",\"\"],[9,\"width\",\"640\"],[9,\"height\",\"360\"],[7],[0,\"\\n\\n      \"],[6,\"source\"],[9,\"src\",\"assets/images/Movement+assessment+video.mp4\"],[9,\"type\",\"video/mp4\"],[7],[8],[0,\"\\n\\n      \"],[6,\"p\"],[7],[0,\"Video is not visible, most likely your browser does not support HTML5 video\"],[8],[0,\"\\n\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/clients.hbs" } });
});
define("front-end/templates/components/add-exercise", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NC7Eh0Jk", "block": "{\"symbols\":[\"file\",\"actionStep\",\"objective\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Exercise\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"newExercise\",\"newExercise\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Adding New Exercise\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"name\"]],\"Add name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"description\"]],\"50\",\"3\",\"Add description\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Objectives\"],[8],[0,\"\\n                \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"objectiveModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,3,[\"value\"]]]]],false],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeObjective\",[19,3,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Objective\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addObjective\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Objective\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Action Steps\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"actionStepModel\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"li\"],[7],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,2,[\"value\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeActionStep\",[19,2,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Action Step\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addActionStep\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Action Step\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                  \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"frequency\"]],\"50\",\"1\",\"Add frequency\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Duration\"],[8],[0,\"\\n                  \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"duration\"]],\"50\",\"1\",\"Add duration\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Image\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"queue\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"ui divided demo items\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"image\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isUploading\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui loader\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"base64Image\"]]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"middle aligned content\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"meta\"],[7],[0,\"\\n                        \"],[6,\"span\"],[7],[0,\"Size: \"],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"description\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"p\"],[7],[0,\"Unsupported image\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"extra\"],[7],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"ui icon red basic button\"],[3,\"action\",[[19,0,[]],\"deleteFile\",[19,1,[]]]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"ui fluid labeled input\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"ui fluid huge label\"],[10,\"style\",[18,\"labelStyle\"],null],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"big cloud upload icon\"],[7],[8],[0,\"\\n                    Click or Drop files into this area to upload files\\n                    \"],[8],[0,\"\\n                    \"],[6,\"input\"],[9,\"type\",\"file\"],[9,\"value\",\"target.value\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectFile\"],null],null],[10,\"style\",[18,\"inputStyle\"],null],[10,\"accept\",[26,[[18,\"accept\"]]]],[10,\"multiple\",[18,\"multiple\"],null],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"br\"],[7],[8],[0,\"\\n                \"],[6,\"button\"],[9,\"class\",\"ui black button\"],[3,\"action\",[[19,0,[]],\"done\",[20,[\"file\"]]]],[7],[0,\"\\n                    Cancel\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/add-exercise.hbs" } });
});
define("front-end/templates/components/add-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "AkruedIp", "block": "{\"symbols\":[\"q\",\"question\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Form\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"newForm\",\"newForm\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Adding New Form\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"name\"]],\"add name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"description\"]],\"50\",\"3\",\"add description\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Questions\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"questionsModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[7],[0,\"\\n                        \"],[6,\"li\"],[7],[0,\"\\n                          \"],[6,\"label\"],[7],[0,\"Question\"],[8],[0,\"\\n                          \"],[6,\"br\"],[7],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection left\",[25,\"action\",[[19,0,[]],\"selectQuestion\",[19,1,[]]],null]]],{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select a Question\"],[8],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"questionModel\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                                \"],[1,[19,2,[\"questionText\"]],false],[0,\"\\n                                            \"],[8],[0,\"\\n\\n\"]],\"parameters\":[2]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeQuestion\",[19,1,[]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addQuestion\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Question\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/add-form.hbs" } });
});
define("front-end/templates/components/add-injury-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JqICEv94", "block": "{\"symbols\":[\"execute\",\"mapper\",\"frm\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Injury Form\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"newInjuryForm\",\"newInjuryForm\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Adding New Injury Form\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"name\"]],\"add name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n          \\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Form\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"allowAdditions\",\"selected\",\"onChange\"],[\"search selection\",true,[20,[\"form\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"form\"]]],null]],null]]],{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Search Forms\"],[8],[0,\"\\n                \"],[6,\"li\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"formModel\"]]],null,{\"statements\":[[0,\"                  \"],[6,\"div\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,2,[]],[19,3,[]]],null]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                    \"],[1,[19,3,[\"name\"]],false],[0,\"\\n                  \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"            \"],[8],[0,\"\\n\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/add-injury-form.hbs" } });
});
define("front-end/templates/components/add-new-plan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+KkrGojt", "block": "{\"symbols\":[\"exercisesList\",\"exercise\",\"assessment\",\"form\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Rehabilitation Plan\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Adding new plan\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"name\"]],\"add name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"description\"]],\"50\",\"3\",\"add description\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Goal\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"goal\"]],\"50\",\"3\",\"add goal\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Assessment Tests\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"assessmentTestModel\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"li\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection left\",[25,\"action\",[[19,0,[]],\"selectForm\",[19,3,[]]],null]]],{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select an Assessment Test\"],[8],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"formModel\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[10,\"data-value\",[26,[[19,4,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                                \"],[1,[19,4,[\"name\"]],false],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"label\"],[7],[0,\"Assessment Test Name\"],[8],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,3,[\"name\"]]]]],false],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[6,\"label\"],[7],[0,\"Assessment Test Description\"],[8],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,3,[\"description\"]]]]],false],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeAssessmentTest\",[19,3,[]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addAssessmentTest\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Assessment Test\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Exercises\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"exercisesListModel\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"li\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection left\",[25,\"action\",[[19,0,[]],\"selectExercise\",[19,1,[]]],null]]],{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select an Exercise\"],[8],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"exerciseModel\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                                \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeExercisesList\",[19,1,[]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addExercisesList\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add Exercise\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/add-new-plan.hbs" } });
});
define("front-end/templates/components/add-question", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Uewgtvz1", "block": "{\"symbols\":[\"questionType\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Question\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"newQuestion\",\"newQuestion\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Adding New Question\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Question Text\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"questionText\"]],\"add question text\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Help Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"helpDescription\"]],\"50\",\"3\",\"add help description\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Question Type\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"questionType\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Question Type\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"questionTypeModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,1,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,1,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/add-question.hbs" } });
});
define("front-end/templates/components/appt-button", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "5EIZBLj/", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui white right floated button\"],[9,\"style\",\"min-width: 0px; background-color: white\"],[7],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/appt-button.hbs" } });
});
define("front-end/templates/components/assessment-test-dropdown", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "BTHOiNRF", "block": "{\"symbols\":[\"test\"],\"statements\":[[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"addAssessmentTest\"],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"assessmentTestModel\"]]],null,{\"statements\":[[0,\"        \"],[6,\"option\"],[10,\"value\",[19,1,[\"id\"]],null],[7],[0,\"\\n            \"],[1,[19,1,[\"name\"]],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\"],[6,\"ol\"],[9,\"id\",\"assessmentTests\"],[7],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/assessment-test-dropdown.hbs" } });
});
define("front-end/templates/components/assign-plan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "70z++Ay4", "block": "{\"symbols\":[\"treatment\",\"rehabilitationPlan\",\"treatment\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        Assign Plan\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"id card outline icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n  Assign Plan to Patient\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Currently Assigned Rehabilitation Plans\"],[8],[0,\"\\n            \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"existingTreatments\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n                        \"],[1,[19,3,[\"rehabilitationPlan\",\"name\"]],false],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[3,\"action\",[[19,0,[]],\"removeExistingTreatment\",[19,3,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                Remove Treatment\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Rehabilitation Plans to be Assigned\"],[8],[0,\"\\n            \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"treatmentModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],\"selectRehabilitationPlan\",[19,1,[]]],null]]],{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select a Rehabilitation Plan\"],[8],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"rehabilitationPlanModel\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"div\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                        \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                                    \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeTreatment\",[19,1,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Rehabilitation Plan\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addTreatment\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add Treatment\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n    No\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n    Yes\\n    \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/assign-plan.hbs" } });
});
define("front-end/templates/components/authenticate-user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lT30pBnC", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Authenticate Your Account!\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"authenticateUser\",\"authenticateUser\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Authenticating Your Account\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[20,[\"email\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Authentication Code\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"encryptedAuth\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Authenticate Now\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/authenticate-user.hbs" } });
});
define("front-end/templates/components/client-report", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "H/MBqU8A", "block": "{\"symbols\":[\"a\"],\"statements\":[[6,\"div\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n  \"],[6,\"a\"],[9,\"href\",\"#\"],[7],[0,\"Send Comments\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Send Comments to Client\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Comments: \"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"description\"]],\"50\",\"5\",\"Summarize the examination findings and treatment plan here.\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Send to: \"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"administrator\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Choose Client\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"profileModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,1,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,1,[\"givenName\"]],false],[0,\" \"],[1,[19,1,[\"familyName\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Send\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/client-report.hbs" } });
});
define("front-end/templates/components/complete-injury-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zprgJzum", "block": "{\"symbols\":[\"questionsList\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Complete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Complete Injury Form\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email\"]],\"Enter your email for contact purposes.\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field assessment-question\"],[7],[0,\"\\n              \"],[6,\"label\"],[7],[0,\"Questions\"],[8],[0,\"\\n              \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"injuryForm\",\"form\",\"questionsLists\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"br\"],[7],[8],[0,\"\\n                    \"],[6,\"li\"],[7],[0,\"\\n                        \"],[6,\"label\"],[7],[1,[19,1,[\"question\",\"questionText\"]],false],[8],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,1,[\"unique\"]]]]],false],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"              \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Done!\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/complete-injury-form.hbs" } });
});
define("front-end/templates/components/complete-test", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uFs3Nw0w", "block": "{\"symbols\":[\"questionsList\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Compete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Complete Assesment Test\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field assessment-question\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Questions\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"assessmentTest\",\"form\",\"questionsLists\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[6,\"li\"],[7],[0,\"\\n                            \"],[6,\"label\"],[7],[1,[19,1,[\"question\",\"questionText\"]],false],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,1,[\"unique\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"              \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Done!\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/complete-test.hbs" } });
});
define("front-end/templates/components/contact-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zGmMH1ZM", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"id\",\"contactForm\"],[9,\"name\",\"sentMessage\"],[9,\"novalidate\",\"\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"name\"]],\"Your Name *\"]]],false],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"help-block text-danger\"],[7],[8],[0,\"\\n          \"],[8],[6,\"br\"],[7],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                  \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"email\",\"50\",\"1\",[20,[\"email\"]],\"Your Email *\"]]],false],[0,\"\\n                  \"],[6,\"p\"],[9,\"class\",\"help-block text-danger\"],[7],[8],[0,\"\\n                \"],[8],[6,\"br\"],[7],[8],[0,\"\\n                      \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"phone\"]],\"Your Phone *\"]]],false],[0,\"\\n                        \"],[6,\"p\"],[9,\"class\",\"help-block text-danger\"],[7],[8],[0,\"\\n                      \"],[8],[6,\"br\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[1,[25,\"textarea\",null,[[\"cols\",\"rows\",\"value\",\"placeholder\"],[\"50\",\"6\",[20,[\"message\"]],\"Your Message *\"]]],false],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"help-block text-danger\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"clearfix\"],[7],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12 text-center\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"id\",\"success\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"ui positive button\"],[9,\"style\",\"background-color: #4f9ec7; color:white\"],[3,\"action\",[[19,0,[]],\"sendMessage\"]],[7],[0,\"\\n            Send Message\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/contact-form.hbs" } });
});
define("front-end/templates/components/country-dropdown", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8Kzq9v9I", "block": "{\"symbols\":[\"country\"],\"statements\":[[6,\"select\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"countryModel\"]]],null,{\"statements\":[[0,\"        \"],[6,\"option\"],[10,\"value\",[19,1,[\"_id\"]],null],[7],[0,\"\\n            \"],[1,[19,1,[\"name\"]],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/country-dropdown.hbs" } });
});
define("front-end/templates/components/create-payment", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "2AseR8Lw", "block": "{\"symbols\":[],\"statements\":[[6,\"head\"],[7],[0,\"\\n  \"],[6,\"link\"],[9,\"href\",\"https://fonts.googleapis.com/css?family=Krona+One\"],[9,\"rel\",\"stylesheet\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"text-align: center\"],[7],[0,\"\\n  \"],[6,\"h3\"],[7],[0,\"Purchase a Package\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center; padding-top: 28px\"],[7],[0,\"\\n    \"],[6,\"h3\"],[7],[0,\"Assessment Package\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Initial consult via email & video conference\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Personal online account Therapy Plan - accessed on your account\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Education, Advice\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n      \"],[6,\"h5\"],[7],[6,\"b\"],[7],[0,\"Payment Notes\"],[8],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui input\"],[7],[0,\"\\n        \"],[1,[25,\"textarea\",null,[[\"cols\",\"rows\",\"placeholder\",\"value\"],[50,5,\"Notes\",[20,[\"notes\"]]]]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"b\"],[7],[0,\"Amount - $150\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[9,\"style\",\"background-color: black\"],[3,\"action\",[[19,0,[]],\"processPayment\"]],[7],[0,\"\\n        Confirm Information\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"form\"],[9,\"action\",\"https://www.sandbox.paypal.com/cgi-bin/webscr\"],[9,\"method\",\"post\"],[9,\"target\",\"_top\"],[7],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"cmd\"],[9,\"value\",\"_s-xclick\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"hosted_button_id\"],[9,\"value\",\"F49PBVPZ6K6KQ\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"image\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\"],[9,\"border\",\"0\"],[9,\"name\",\"submit\"],[9,\"alt\",\"PayPal - The safer, easier way to pay online!\"],[7],[8],[0,\"\\n      \"],[6,\"img\"],[9,\"alt\",\"\"],[9,\"border\",\"0\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\"],[9,\"width\",\"1\"],[9,\"height\",\"1\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center\"],[7],[0,\"\\n    \"],[6,\"h3\"],[7],[0,\"Assessment Package + 3 Sessions\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Initial consult via email & video conference\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"3 further online sessions via email & video conference\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Personal online account Therapy Plan - accessed on your account\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Education, Advice\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n      \"],[6,\"h5\"],[7],[6,\"b\"],[7],[0,\"Payment Notes\"],[8],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui input\"],[7],[0,\"\\n        \"],[1,[25,\"textarea\",null,[[\"cols\",\"rows\",\"placeholder\",\"value\"],[50,5,\"Notes\",[20,[\"notes1\"]]]]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"b\"],[7],[0,\"Amount - $350\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[9,\"style\",\"background-color: black\"],[3,\"action\",[[19,0,[]],\"processPayment1\"]],[7],[0,\"\\n        Confirm Information\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"form\"],[9,\"action\",\"https://www.sandbox.paypal.com/cgi-bin/webscr\"],[9,\"method\",\"post\"],[9,\"target\",\"_top\"],[7],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"cmd\"],[9,\"value\",\"_s-xclick\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"hosted_button_id\"],[9,\"value\",\"FVUF2HT9LU2JA\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"image\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\"],[9,\"border\",\"0\"],[9,\"name\",\"submit\"],[9,\"alt\",\"PayPal - The safer, easier way to pay online!\"],[7],[8],[0,\"\\n      \"],[6,\"img\"],[9,\"alt\",\"\"],[9,\"border\",\"0\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\"],[9,\"width\",\"1\"],[9,\"height\",\"1\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center\"],[7],[0,\"\\n    \"],[6,\"h3\"],[7],[0,\"Assessment Package + 6 Sessions\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Initial consult via email & video conference\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"6 further online sessions via email & video conference\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Personal online account Therapy Plan - accessed on your account\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Education, Advice\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n      \"],[6,\"h5\"],[7],[6,\"b\"],[7],[0,\"Payment Notes\"],[8],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui input\"],[7],[0,\"\\n        \"],[1,[25,\"textarea\",null,[[\"cols\",\"rows\",\"placeholder\",\"value\"],[50,5,\"Notes\",[20,[\"notes2\"]]]]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"b\"],[7],[0,\"Amount - $550\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[9,\"style\",\"background-color: black\"],[3,\"action\",[[19,0,[]],\"processPayment2\"]],[7],[0,\"\\n        Confirm Information\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"form\"],[9,\"action\",\"https://www.sandbox.paypal.com/cgi-bin/webscr\"],[9,\"method\",\"post\"],[9,\"target\",\"_top\"],[7],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"cmd\"],[9,\"value\",\"_s-xclick\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"hosted_button_id\"],[9,\"value\",\"R55HV76M8QT7N\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"image\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\"],[9,\"border\",\"0\"],[9,\"name\",\"submit\"],[9,\"alt\",\"PayPal - The safer, easier way to pay online!\"],[7],[8],[0,\"\\n      \"],[6,\"img\"],[9,\"alt\",\"\"],[9,\"border\",\"0\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\"],[9,\"width\",\"1\"],[9,\"height\",\"1\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"h1\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"\\n    OR\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"text-align: center;\"],[7],[0,\"\\n  \"],[6,\"h3\"],[7],[0,\"Purchase a Single Appointment\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center\"],[7],[0,\"\\n    \"],[6,\"h3\"],[7],[0,\"\\n      Single Follow-up Appointment\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n      \"],[6,\"h5\"],[7],[6,\"b\"],[7],[0,\"Payment Notes\"],[8],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui input\"],[7],[0,\"\\n        \"],[1,[25,\"textarea\",null,[[\"cols\",\"rows\",\"placeholder\",\"value\"],[50,5,\"Notes\",[20,[\"notes2\"]]]]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"b\"],[7],[0,\"Amount - $75\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[9,\"style\",\"background-color: black\"],[3,\"action\",[[19,0,[]],\"processPayment3\"]],[7],[0,\"\\n        Confirm Information\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"form\"],[9,\"action\",\"https://www.sandbox.paypal.com/cgi-bin/webscr\"],[9,\"method\",\"post\"],[9,\"target\",\"_top\"],[7],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"cmd\"],[9,\"value\",\"_s-xclick\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"hidden\"],[9,\"name\",\"hosted_button_id\"],[9,\"value\",\"HH54EJZEX2GM6\"],[7],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"image\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif\"],[9,\"border\",\"0\"],[9,\"name\",\"submit\"],[9,\"alt\",\"PayPal - The safer, easier way to pay online!\"],[7],[8],[0,\"\\n      \"],[6,\"img\"],[9,\"alt\",\"\"],[9,\"border\",\"0\"],[9,\"src\",\"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif\"],[9,\"width\",\"1\"],[9,\"height\",\"1\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/create-payment.hbs" } });
});
define("front-end/templates/components/delete-exercise", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "HRttp/YH", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Delete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Delete Exercise?\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n        No\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Yes\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/delete-exercise.hbs" } });
});
define("front-end/templates/components/delete-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "CZOqTzXu", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Delete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Delete Form?\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n        No\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Yes\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/delete-form.hbs" } });
});
define("front-end/templates/components/delete-injury-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qT61gruB", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Delete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Delete Injury Form?\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n        No\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Yes\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/delete-injury-form.hbs" } });
});
define("front-end/templates/components/delete-plan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ClSPse+M", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Delete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Delete Post?\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n        No\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Yes\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/delete-plan.hbs" } });
});
define("front-end/templates/components/delete-question", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DmiB0oS6", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Delete\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Delete Question?\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n        No\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Yes\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/delete-question.hbs" } });
});
define("front-end/templates/components/exercise-dropdown", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jCHPo/jp", "block": "{\"symbols\":[\"exercise\"],\"statements\":[[6,\"select\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"addExercise\"],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"exerciseModel\"]]],null,{\"statements\":[[0,\"        \"],[6,\"option\"],[10,\"value\",[19,1,[\"id\"]],null],[7],[0,\"\\n            \"],[1,[19,1,[\"name\"]],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\"],[6,\"ol\"],[9,\"name\",\"exercises\"],[9,\"id\",\"list\"],[7],[0,\"\\n    \\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/exercise-dropdown.hbs" } });
});
define("front-end/templates/components/forgot-password", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "yHwlo80a", "block": "{\"symbols\":[],\"statements\":[[6,\"head\"],[7],[0,\"\\n  \"],[6,\"link\"],[9,\"href\",\"https://fonts.googleapis.com/css?family=Krona+One\"],[9,\"rel\",\"stylesheet\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[9,\"style\",\"text-align: center\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui blue right labeled icon button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n        Forgot Password?\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"changePassword\",\"changePassword\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Forgot Password\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"sent\"]]],null,{\"statements\":[[0,\"                \"],[6,\"p\"],[7],[0,\"\\n                    Enter the authentication code that was sent to your email.\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Authentication Code\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"authenticationCode\"]],\"Enter Authentication Code\"]]],false],[0,\" \\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                \"],[6,\"p\"],[7],[0,\"\\n                    Enter your user account name, and confirm your new password. A confirmation code \\n                    will be sent to your email, which you'll need to enter again here.\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"userAccountName\"]],\"Enter User Account Name\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"New Password\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"newPassword\"]],\"Enter New Password\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Confirm New Password\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"confirmPassword\"]],\"Confirm New Password\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n            Save\\n            \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/forgot-password.hbs" } });
});
define("front-end/templates/components/generate-data", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "P8jcwdtp", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"generateData\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Generate Data (COMPLETE)\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/generate-data.hbs" } });
});
define("front-end/templates/components/log-out", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "12J80UI5", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"logout\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Logout\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/log-out.hbs" } });
});
define("front-end/templates/components/login-user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "yYEzafYT", "block": "{\"symbols\":[],\"statements\":[[6,\"head\"],[7],[0,\"\\n  \"],[6,\"link\"],[9,\"href\",\"https://fonts.googleapis.com/css?family=Krona+One\"],[9,\"rel\",\"stylesheet\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"header\"],[9,\"style\",\"font-family:'Krona One'; text-align: center; font-size:22px\"],[7],[0,\"        LOGIN\\n\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\"],[\"text\",\"User Account Name\",[20,[\"userAccountName\"]]]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Password\"],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\"],[\"password\",\"Password\",[20,[\"password\"]]]]],false],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[9,\"style\",\"text-align: center\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui blue right labeled icon button\"],[3,\"action\",[[19,0,[]],\"login\"]],[7],[0,\"\\n        Login\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/login-user.hbs" } });
});
define("front-end/templates/components/modify-admin-profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "UW9NbzPB", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Administrator Profile\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify First Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"givenName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"familyName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-admin-profile.hbs" } });
});
define("front-end/templates/components/modify-client-profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rcR4akGF", "block": "{\"symbols\":[\"city\",\"province\",\"country\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Client Profile\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify First Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"givenName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"familyName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Postal Code\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"postalCode\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Phone\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"phone\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Country\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"selection\",[20,[\"country\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"country\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Country\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"countryModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,3,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,3,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Province\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"selection\",[20,[\"province\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"province\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"province\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"provinceModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify City\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"selection\",[20,[\"city\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"city\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"City\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"cityModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,1,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,1,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-client-profile.hbs" } });
});
define("front-end/templates/components/modify-client", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "k/y8Kcw0", "block": "{\"symbols\":[\"execute\",\"mapper\",\"gend\",\"execute\",\"mapper\",\"cit\",\"execute\",\"mapper\",\"prov\",\"execute\",\"mapper\",\"count\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Client\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"First Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"givenName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"familyName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Phone Number\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"phone\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Date Of Birth\"],[8],[0,\"\\n                \"],[1,[25,\"pikaday-input\",null,[[\"formate\",\"readonly\",\"value\",\"yearRange\",\"onSelection\"],[\"YYYY/MM/DD\",\"readonly\",[20,[\"DOB\"]],\"100\",[25,\"action\",[[19,0,[]],\"selectDate\"],null]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Postal Code\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"postalCode\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Phone\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"phone\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Marital Status\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"maritalStatus\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Occupation\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"occupation\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Country\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"allowAdditions\",\"selected\",\"onChange\"],[\"search selection\",true,[20,[\"country\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"country\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Search Countries\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"countryModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,11,[]],[19,12,[]]],null]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                \"],[1,[19,12,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[12]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[10,11]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Province\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"allowAdditions\",\"selected\",\"onChange\"],[\"search selection\",true,[20,[\"province\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"province\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Search Provinces\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"provinceModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,8,[]],[19,9,[]]],null]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                \"],[1,[19,9,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[9]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[7,8]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"City\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"allowAdditions\",\"selected\",\"onChange\"],[\"search selection\",true,[20,[\"city\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"city\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Search Cities\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"cityModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,5,[]],[19,6,[]]],null]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                \"],[1,[19,6,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[4,5]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Gender\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"allowAdditions\",\"selected\",\"onChange\"],[\"search selection\",true,[20,[\"gender\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"gender\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Search Genders\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"genderModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,2,[]],[19,3,[]]],null]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                \"],[1,[19,3,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-client.hbs" } });
});
define("front-end/templates/components/modify-exercise", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8Uvek5Nk", "block": "{\"symbols\":[\"file\",\"actionStep\",\"objective\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Exercise\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[20,[\"name\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"description\"]],\"50\",\"3\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Objectives\"],[8],[0,\"\\n                \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"objectiveModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,3,[\"value\"]]]]],false],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeObjective\",[19,3,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Objective\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addObjective\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Objective\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Action Steps\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"actionStepModel\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"li\"],[7],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,2,[\"value\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeActionStep\",[19,2,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Action Step\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addActionStep\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Action Step\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Frequency\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"frequency\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Duration\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"duration\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Image\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"queue\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"ui divided demo items\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"image\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isUploading\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui loader\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"base64Image\"]]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"middle aligned content\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"meta\"],[7],[0,\"\\n                        \"],[6,\"span\"],[7],[0,\"Size: \"],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"description\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"p\"],[7],[0,\"Unsupported image\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"extra\"],[7],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"ui icon red basic button\"],[3,\"action\",[[19,0,[]],\"deleteFile\",[19,1,[]]]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"ui fluid labeled input\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"ui fluid huge label\"],[10,\"style\",[18,\"labelStyle\"],null],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"big cloud upload icon\"],[7],[8],[0,\"\\n                    Click or Drop files into this area to upload files\\n                    \"],[8],[0,\"\\n                    \"],[6,\"input\"],[9,\"type\",\"file\"],[9,\"value\",\"target.value\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectFile\"],null],null],[10,\"style\",[18,\"inputStyle\"],null],[10,\"accept\",[26,[[18,\"accept\"]]]],[10,\"multiple\",[18,\"multiple\"],null],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"br\"],[7],[8],[0,\"\\n                \"],[6,\"button\"],[9,\"class\",\"ui black button\"],[3,\"action\",[[19,0,[]],\"done\",[20,[\"file\"]]]],[7],[0,\"\\n                    Cancel\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-exercise.hbs" } });
});
define("front-end/templates/components/modify-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NmBaQcWa", "block": "{\"symbols\":[\"newQuestion\",\"question\",\"questionsList\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Form\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[20,[\"name\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"description\"]],\"50\",\"3\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Existing Questions\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"questionsListsQuestions\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"ii\"],[7],[0,\"\\n                            \"],[6,\"li\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"nn\"],[7],[0,\"\\n                                    \"],[1,[19,3,[\"question\",\"questionText\"]],false],[0,\"\\n                                \"],[8],[0,\"\\n                            \\n                                \"],[6,\"br\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeExistingQuestionsList\",[19,3,[]]]],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                        Remove Question\\n                                    \"],[8],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"br\"],[7],[8],[0,\"  \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"New Questions\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"newQuestions\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"li\"],[7],[0,\"\\n                                \"],[6,\"div\"],[7],[0,\"\\n                                    \"],[6,\"label\"],[7],[0,\"Question\"],[8],[0,\"\\n                                    \"],[6,\"br\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection left\",[25,\"action\",[[19,0,[]],\"selectQuestion\",[19,1,[]]],null]]],{\"statements\":[[0,\"                                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select a Question\"],[8],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                        \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"questionModel\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                                \"],[1,[19,2,[\"questionText\"]],false],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                                \"],[6,\"br\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeNewQuestion\",[19,1,[]]]],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                        \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                    \"],[8],[0,\"\\n                                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove\"],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addQuestion\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Question\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-form.hbs" } });
});
define("front-end/templates/components/modify-physio-profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "0vV9QYWX", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Physiotherapist Profile\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify First Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"givenName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"familyName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"byAdmin\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Date Finished\"],[8],[0,\"\\n                    \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"yearRange\",\"readonly\",\"onSelection\",\"placeholder\"],[[20,[\"dateFinished\"]],\"MM/DD/YY\",\"120\",\"readonly\",[25,\"action\",[[19,0,[]],\"selectDateFinished\"],null],\"Select Date\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-physio-profile.hbs" } });
});
define("front-end/templates/components/modify-plan", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "/Ecj2wSV", "block": "{\"symbols\":[\"exercisesList\",\"exercise\",\"exercisesList\",\"assessment\",\"form\",\"assessment\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Rehabilitation Plan\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[20,[\"name\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"description\"]],\"50\",\"3\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Goal\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"goal\"]],\"50\",\"3\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Existing Assessment Tests\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"existingAssessmentTests\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"ii\"],[7],[0,\"\\n                        \"],[6,\"li\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"nn\"],[7],[0,\"\\n\\n                            \"],[6,\"label\"],[7],[0,\"Assessment Test Name\"],[8],[0,\"\\n\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ii\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,6,[\"name\"]]]]],false],[0,\"\\n                          \"],[8],[0,\"\\n                          \"],[6,\"div\"],[9,\"class\",\"ii\"],[7],[0,\"\\n                          \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"label\"],[7],[0,\"Assessment Test Description\"],[8],[0,\"\\n                          \"],[8],[0,\"\\n                          \"],[6,\"div\"],[9,\"class\",\"ii\"],[7],[0,\"\\n                          \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,6,[\"description\"]]]]],false],[0,\"\\n                          \"],[8],[0,\"\\n                          \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeExistingAssessmentTest\",[19,6,[]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    Remove Assessment Test\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                              \"],[6,\"br\"],[7],[8],[0,\"  \"],[6,\"br\"],[7],[8],[0,\" \"],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                      \"],[8],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"                \"],[8],[0,\"\\n\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"New Assessment Tests\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"assessmentTestModel\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"div\"],[7],[0,\"\\n                        \"],[6,\"li\"],[7],[0,\"\\n                          \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"label\"],[7],[0,\"Form\"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                          \"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"id\",\"class\",\"onChange\"],[[19,4,[\"id\"]],\"selection left\",[25,\"action\",[[19,0,[]],\"selectForm\",[19,4,[]]],null]]],{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select an Assessment Test\"],[8],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"formModel\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[10,\"data-value\",[26,[[19,5,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                                \"],[1,[19,5,[\"name\"]],false],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"label\"],[7],[0,\"Assessment Test Name\"],[8],[0,\"\\n                          \"],[8],[0,\"\\n                          \"],[6,\"div\"],[7],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,4,[\"name\"]]]]],false],[0,\"\\n                          \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"label\"],[7],[0,\"Assessment Test Description\"],[8],[0,\"\\n                            \"],[6,\"div\"],[7],[0,\"\\n                              \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,4,[\"description\"]]]]],false],[0,\"\\n                          \"],[8],[0,\"\\n                          \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeAssessmentTest\",[19,4,[]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                      \"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addAssessmentTest\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Assessment Test\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Existing Exercises\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"existingExercisesLists\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[7],[0,\"\\n                        \"],[6,\"li\"],[7],[0,\"\\n                            \"],[1,[19,3,[\"exercise\",\"name\"]],false],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeExistingExercisesList\",[20,[\"assessment\"]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    Remove Exercise\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                      \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"New Exercises\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"exercisesListModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[7],[0,\"\\n                        \"],[6,\"li\"],[7],[0,\"\\n                          \"],[6,\"label\"],[7],[0,\"Exercise\"],[8],[0,\"\\n                          \"],[6,\"br\"],[7],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection left\",[25,\"action\",[[19,0,[]],\"selectExercise\",[19,1,[]]],null]]],{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select an Exercise\"],[8],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                    \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"exerciseModel\"]]],null,{\"statements\":[[0,\"                                            \"],[6,\"div\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                                \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                                            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                            \"],[6,\"br\"],[7],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button gotcha\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeExercisesList\",[19,1,[]]]],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                    \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                                \"],[8],[0,\"\\n                                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove\"],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addExercisesList\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add Exercise\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-plan.hbs" } });
});
define("front-end/templates/components/modify-question", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Aak23p5g", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying Question\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Question Text\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[20,[\"questionText\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Help Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"helpDescription\"]],\"50\",\"3\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-question.hbs" } });
});
define("front-end/templates/components/modify-user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "1TEYCyPK", "block": "{\"symbols\":[\"gender\",\"city\",\"province\",\"country\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[6,\"i\"],[9,\"class\",\"edit icon\"],[7],[8],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Edit\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Modifying User\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify First Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"givenName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Modify Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"cols\",\"rows\"],[\"text\",[20,[\"familyName\"]],\"50\",\"1\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"role\",\"isPatientProfile\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Postal Code\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"postalCode\"]],\"50\",\"1\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Phone\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"value\",\"cols\",\"rows\"],[[20,[\"phone\"]],\"50\",\"1\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Country\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"country\"]]],null]],null]]],{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Country\"],[8],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"countryModel\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,4,[\"id\"]]]]],[7],[0,\"\\n                                    \"],[1,[19,4,[\"name\"]],false],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Province\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"province\"]]],null]],null]]],{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Province\"],[8],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"provinceModel\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,3,[\"id\"]]]]],[7],[0,\"\\n                                    \"],[1,[19,3,[\"name\"]],false],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify City\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"city\"]]],null]],null]]],{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"City\"],[8],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"cityModel\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[7],[0,\"\\n                                    \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Gender\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"gender\"]]],null]],null]]],{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Gender\"],[8],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"genderModel\"]]],null,{\"statements\":[[0,\"                                \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,1,[\"id\"]]]]],[7],[0,\"\\n                                    \"],[1,[19,1,[\"name\"]],false],[0,\"\\n                                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Date Hired\"],[8],[0,\"\\n                    \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"readonly\",\"onSelection\",\"placeholder\"],[[20,[\"date\"]],\"MM/DD/YY\",\"readonly\",[25,\"action\",[[19,0,[]],\"selectDateHired\"],null],\"Select Date\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                    \"],[6,\"label\"],[7],[0,\"Modify Date Finished\"],[8],[0,\"\\n                    \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"readonly\",\"onSelection\",\"placeholder\"],[[20,[\"date\"]],\"MM/DD/YY\",\"readonly\",[25,\"action\",[[19,0,[]],\"selectDateFinished\"],null],\"Select Date\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Disable Account\"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui toggle checkbox\"],[7],[0,\"\\n                  \"],[2,\" {{#each userAccountModel as |user|}} -->\\n                      <!-- <div class=\\\"item\\\" data-value=\\\"{{user.id}}\\\">\\n                          {{user.active}} -->\\n                          <input type=\\\"checkbox\\\" name=\\\"public\\\" id=\\\"toggle-1\\\"><label class=\\\"dn\\\" for=\\\"toggle-1\\\" data-content=\\\"OFF\\\"></label>\\n                      <!-- </div> -->\\n                  <!-- {{/each}} \"],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/modify-user.hbs" } });
});
define("front-end/templates/components/new-appointment", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vs15zUYT", "block": "{\"symbols\":[\"execute\",\"mapper\",\"t\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Book Appointment\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui form\"],[9,\"style\",\"width: 30%\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"\\n                Date\\n                \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"readonly\",\"onSelection\",\"placeholder\",\"options\"],[[20,[\"date\"]],\"MM/DD/YY\",\"readonly\",[25,\"action\",[[19,0,[]],\"doSomethingWithSelectedValue\"],null],\"Select Date\",[25,\"hash\",null,[[\"disableWeekends\"],[true]]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Time\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"selected\",\"onChange\"],[\"selection\",[20,[\"time\"]],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"time\"]]],null]],null]]],{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Available Times\"],[8],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"Select from below...\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"times\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[10,\"data-value\",[26,[[25,\"map-value\",[[19,2,[]],[19,3,[]]],null]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                        \"],[1,[19,3,[]],false],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"            \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Reason For Appointment\"],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\"],[\"text\",\"Reason\",[20,[\"reason\"]]]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Additional Notes\"],[8],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"placeholder\",\"value\"],[\"text\",\"Notes\",[20,[\"other\"]]]]],false],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[9,\"style\",\"background-color: #4f9ec7\"],[3,\"action\",[[19,0,[]],\"BookAppointment\"]],[7],[0,\"\\n                Book Appointment\\n                \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/new-appointment.hbs" } });
});
define("front-end/templates/components/register-admin", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Fvjf4sPz", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Register an Administrator\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"registerAdmin\",\"registerAdmin\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Registering A New Administrator\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email1\"]],\"Add email\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Confirm Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email2\"]],\"Confirm email\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Password\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"password1\"]],\"Add password\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Confirm Password\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"password2\"]],\"Confirm password\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"userAccountName\"]],\"50\",\"1\",\"Add user account name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"First Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"givenName\"]],\"50\",\"1\",\"Add first name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"familyName\"]],\"50\",\"1\",\"Add last name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"\\n                    Date Hired\\n                    \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"yearRange\",\"readonly\",\"onSelection\",\"placeholder\"],[[20,[\"date\"]],\"MM/DD/YY\",\"50\",\"readonly\",[25,\"action\",[[19,0,[]],\"selectDate\"],null],\"Select Date\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n            Save\\n            \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/register-admin.hbs" } });
});
define("front-end/templates/components/register-physiotherapist", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6uCVaONi", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Register a Physiotherapist\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"registerPhysiotherapist\",\"registerPhysiotherapist\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Registering A New Physiotherapist\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email1\"]],\"Add email\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Confirm Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email2\"]],\"Confirm email\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Password\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"password1\"]],\"Add password\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Confirm Password\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"password2\"]],\"Confirm password\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"userAccountName\"]],\"50\",\"1\",\"Add user account name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"First Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"givenName\"]],\"50\",\"1\",\"Add first name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"familyName\"]],\"50\",\"1\",\"Add last name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"\\n                    Date Hired\\n                    \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"yearRange\",\"readonly\",\"onSelection\",\"placeholder\"],[[20,[\"date\"]],\"MM/DD/YY\",\"50\",\"readonly\",[25,\"action\",[[19,0,[]],\"selectDate\"],null],\"Select Date\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n            Save\\n            \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/register-physiotherapist.hbs" } });
});
define("front-end/templates/components/register-user", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "LKQ/PKYK", "block": "{\"symbols\":[\"city\",\"province\",\"country\",\"gender\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Register a Patient Profile\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"registerUser\",\"registerUser\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Registering As A New User\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email1\"]],\"Add email\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Confirm Email\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"email2\"]],\"Confirm email\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Password\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"password1\"]],\"Add password\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Confirm Password\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"password\",\"50\",\"1\",[20,[\"password2\"]],\"Confirm password\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"userAccountName\"]],\"50\",\"1\",\"Add user account name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Phone\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"phone\"]],\"50\",\"1\",\"Add phone\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"First Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"givenName\"]],\"50\",\"1\",\"Add first name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Last Name\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"familyName\"]],\"50\",\"1\",\"Add last name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Gender\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"gender\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Gender\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"genderModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,4,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,4,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"\\n                    Date of Birth\\n                    \"],[1,[25,\"pikaday-input\",null,[[\"value\",\"format\",\"yearRange\",\"readonly\",\"onSelection\",\"placeholder\"],[[20,[\"date\"]],\"MM/DD/YY\",\"120\",\"readonly\",[25,\"action\",[[19,0,[]],\"selectDate\"],null],\"Select Date\"]]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Country\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"country\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Country\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"countryModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,3,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,3,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Province\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"province\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"province\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"provinceModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"City\"],[8],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"city\"]]],null]],null]]],{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"City\"],[8],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"cityModel\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"item\"],[10,\"data-value\",[26,[[19,1,[\"id\"]]]]],[7],[0,\"\\n                                \"],[1,[19,1,[\"name\"]],false],[0,\"\\n                            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Postal Code\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"postalCode\"]],\"50\",\"1\",\"Add postal code\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n            Cancel\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n            Save\\n            \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/register-user.hbs" } });
});
define("front-end/templates/components/show-injury-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Ru4mKBlc", "block": "{\"symbols\":[\"injuryResult\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue right floated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    View\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Injury Form Information\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"completedInjuryForm\",\"injuryResults\"]]],null,{\"statements\":[[0,\"              \"],[6,\"h5\"],[7],[0,\"Question\"],[8],[0,\"\\n              \"],[1,[19,1,[\"questionText\"]],false],[0,\"\\n              \"],[6,\"h5\"],[7],[0,\"Answer\"],[8],[0,\"\\n              \"],[1,[19,1,[\"answer\"]],false],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[2,\" <div class=\\\"ui black deny button\\\">\\n        Cancel\\n    </div> \"],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Return\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/show-injury-form.hbs" } });
});
define("front-end/templates/components/simple-example", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "KdZCRnp6", "block": "{\"symbols\":[\"image\"],\"statements\":[[4,\"if\",[[20,[\"ImageIsAdding\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"ui container\"],[7],[0,\"\\n    \"],[1,[25,\"upload-files\",null,[[\"model\",\"maximumFileSize\",\"multiple\",\"flag\"],[\"image\",6,true,[20,[\"ImageIsAdding\"]]]]],false],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"ui items\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui small image\"],[7],[0,\"\\n          \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"imageData\"]]]]],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"middle aligned content\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"meta\"],[7],[0,\"\\n            \"],[6,\"span\"],[7],[0,\"Size: \"],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"description\"],[7],[0,\"\\n            \"],[6,\"span\"],[7],[0,\"Type: \"],[1,[19,1,[\"type\"]],false],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"extra\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"ui icon red basic button\"],[3,\"action\",[[19,0,[]],\"deleteImage\",[19,1,[]]]],[7],[0,\"\\n              \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n  \"],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"button\"],[9,\"class\",\"ui blue button\"],[3,\"action\",[[19,0,[]],\"addNewImage\"]],[7],[0,\"\\n    Add New Image\\n  \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/simple-example.hbs" } });
});
define("front-end/templates/components/to-do-list", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "VDVh/Ntk", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[6,\"style\"],[7],[0,\"\\nbody {\\n  margin: 0;\\n  min-width: 250px;\\n}\\n\\n/* Include the padding and border in an element's total width and height */\\n* {\\n  box-sizing: border-box;\\n}\\n\\n/* Remove margins and padding from the list */\\nul {\\n  margin: 0;\\n  padding: 0;\\n}\\n\\n/* Style the list items */\\nul li {\\n  cursor: pointer;\\n  position: relative;\\n  padding: 12px 8px 12px 40px;\\n  list-style-type: none;\\n  background: #eee;\\n  font-size: 18px;\\n  transition: 0.2s;\\n\\n  /* make the list items unselectable */\\n  -webkit-user-select: none;\\n  -moz-user-select: none;\\n  -ms-user-select: none;\\n  user-select: none;\\n}\\n\\n/* Set all odd list items to a different color (zebra-stripes) */\\nul li:nth-child(odd) {\\n  background: #f9f9f9;\\n}\\n\\nul li:nth-child(odd):hover {\\n  background:  #0d84dd;\\n}\\n\\n/* Darker background-color on hover */\\nul li:hover {\\n  background: #0d84dd;\\n}\\n\\n/* When clicked on, add a background color and strike out text */\\nul li.checked {\\n  background: #888;\\n  color: #fff;\\n  text-decoration: line-through;\\n}\\n\\n/* Add a \\\"checked\\\" mark when clicked on */\\nul li.checked::before {\\n  content: '';\\n  position: absolute;\\n  border-color: #fff;\\n  border-style: solid;\\n  border-width: 0 2px 2px 0;\\n  top: 10px;\\n  left: 16px;\\n  transform: rotate(45deg);\\n  height: 15px;\\n  width: 7px;\\n}\\n\\n/* Style the close button */\\n.close {\\n  position: absolute;\\n  right: 0;\\n  top: 0;\\n  padding: 12px 16px 12px 16px;\\n}\\n\\n.close:hover {\\n  background-color: #f44336;\\n  color: white;\\n}\\n\\n/* Style the header */\\n.header {\\n  background-color: #2e70b5;\\n  padding: 30px 40px;\\n  color: white;\\n  /* text-align: center; */\\n}\\n\\n/* Clear floats after the header */\\n.header:after {\\n  content: \\\"\\\";\\n  display: table;\\n  clear: both;\\n}\\n\\n/* Style the input */\\ninput {\\n  border: none;\\n  width: 75%;\\n  padding: 10px;\\n  float: left;\\n  font-size: 16px;\\n  height: 40px;\\n}\\n\\n/* Style the \\\"Add\\\" button */\\n.addBtn {\\n  padding: 10px;\\n  width: 25%;\\n  height: 40px;\\n  background: #d9d9d9;\\n  color: #555;\\n  float: left;\\n  text-align: center;\\n  font-size: 16px;\\n  cursor: pointer;\\n  transition: 0.3s;\\n}\\n\\n.addBtn:hover {\\n  background-color: #bbb;\\n}\\n\\nul li{\\n  background: #1951ae;\\n}\\n\\nul li:nth-child(2n+1){\\n  background: #0e359f;\\n}\\n\\n\"],[8],[0,\"\\n\"],[6,\"body\"],[7],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"container todolist\"],[9,\"style\",\"margin: 6em;\"],[7],[0,\"\\n\\n\\n\"],[6,\"div\"],[9,\"id\",\"myDIV\"],[9,\"class\",\"header\"],[7],[0,\"\\n  \"],[6,\"h2\"],[9,\"style\",\"margin:5px\"],[7],[0,\"My To Do List\"],[8],[0,\"\\n  \"],[2,\" <input type=\\\"text\\\" id=\\\"myInput\\\" placeholder=\\\"Title...\\\">\\n  <span onclick=\\\"newElement()\\\" class=\\\"addBtn\\\">Add</span> \"],[0,\"\\n  \"],[6,\"div\"],[7],[0,\"\\n        \"],[6,\"br\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"form\"],[9,\"class\",\"form-inline\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[1,[25,\"input\",null,[[\"id\",\"type\",\"placeholder\",\"value\",\"class\"],[\"myInput\",\"text\",\"Task name\",[20,[\"newTask\"]],\"form-control\"]]],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"button\"],[9,\"class\",\"addBtn\"],[9,\"class\",\"btn btn-primary\"],[3,\"action\",[[19,0,[]],\"addTodo\"]],[7],[0,\"Add\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n  \"],[6,\"br\"],[7],[8],[0,\"\\n\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"col-xs-12\"],[7],[0,\"\\n    \"],[6,\"div\"],[7],[0,\"\\n          \"],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"h4\"],[7],[6,\"b\"],[7],[8],[8],[0,\"\\n    \"],[6,\"ul\"],[9,\"id\",\"myUL\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"todo\"]],[20,[\"in\"]],[20,[\"model2\"]]],null,{\"statements\":[[0,\"      \"],[6,\"li\"],[7],[0,\"\\n        \"],[1,[20,[\"todo\",\"task\"]],false],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[2,\" {{#each todo in model2 itemController='todo'}}\\n        <li>\\n          {{#if todo.isEditing}}\\n          <form class=\\\"form-inline\\\">\\n            <div class=\\\"form-group\\\">\\n              {{input type='text' placeholder='Task name' value=todo.model.task class='form-control'}}\\n            </div>\\n            <button {{action 'updateTodo'}} class=\\\"btn btn-primary\\\">update</button>\\n            <button {{action 'cancel'}} class=\\\"btn btn-default\\\">cancel</button>\\n            </form>\\n          {{else}}\\n            <h4 {{bind-attr class=\\\"todolist.completed:strike\\\"}}>\\n              {{input type=\\\"checkbox\\\" checked=todo.completed class=\\\"toggle\\\"}}\\n              {{todo.model2.task}}\\n              <div class=\\\"actions\\\">\\n                <a {{action 'editTodo'}} href class=\\\"edit-todo\\\">\\n                  <span class=\\\"glyphicon glyphicon-pencil\\\"></span>\\n                </a>\\n                <a {{action 'removeTodo' todo}} href class=\\\"remove-todo\\\">\\n                  <span class=\\\"glyphicon glyphicon-remove\\\"></span>\\n                </a>\\n              </div>\\n            </h4>\\n          {{/if}}\\n        </li>\\n        <hr>\\n      {{else}}\\n        <h4>No Tasks to do</h4>\\n      {{/each}} \"],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[2,\" <ul id=\\\"myUL\\\">\\n  <li>Hit the gym</li>\\n  <li class=\\\"checked\\\">Pay bills</li>\\n  <li>Meet George</li>\\n  <li>Buy eggs</li>\\n  <li>Read a book</li>\\n  <li>Organize office</li>\\n</ul> \"],[0,\"\\n\\n\\n\"],[2,\"\\n<ul id=\\\"myUL\\\" {{action \\\"pressed\\\"}}>\\n  <li>Hit the gym</li>\\n  <li class=\\\"checked\\\">Pay bills</li>\\n  <li>Meet George</li>\\n  <li>Buy eggs</li>\\n  <li>Read a book</li>\\n  <li>Organize office</li>\\n</ul> \"],[0,\"\\n\"],[2,\"\\n</div>\\n\\n</body> \"],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/to-do-list.hbs" } });
});
define("front-end/templates/components/ui-accordion", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Q0TPABWr", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-accordion.hbs" } });
});
define("front-end/templates/components/ui-checkbox", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mESZfIqW", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"input\"],[10,\"type\",[18,\"type\"],null],[10,\"name\",[18,\"name\"],null],[10,\"tabindex\",[18,\"tabindex\"],null],[10,\"checked\",[25,\"unbound\",[[20,[\"checked\"]]],null],null],[10,\"disabled\",[25,\"unbound\",[[20,[\"disabled\"]]],null],null],[7],[8],[0,\"\\n\"],[6,\"label\"],[7],[1,[18,\"label\"],false],[8],[0,\"\\n\"],[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-checkbox.hbs" } });
});
define("front-end/templates/components/ui-dimmer", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8aztSqsu", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-dimmer.hbs" } });
});
define("front-end/templates/components/ui-dropdown", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "O5CORRXv", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null],[25,\"action\",[[19,0,[]],\"mapping\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-dropdown.hbs" } });
});
define("front-end/templates/components/ui-embed", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Ert5glYa", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-embed.hbs" } });
});
define("front-end/templates/components/ui-modal", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "dN5U0b3E", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-modal.hbs" } });
});
define("front-end/templates/components/ui-nag", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FClM0GlK", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-nag.hbs" } });
});
define("front-end/templates/components/ui-popup", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "LSgGVzxJ", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-popup.hbs" } });
});
define("front-end/templates/components/ui-progress", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "l2h9Pp8T", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-progress.hbs" } });
});
define("front-end/templates/components/ui-radio", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "IkhV4Zgb", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"input\"],[10,\"type\",[18,\"type\"],null],[10,\"name\",[18,\"name\"],null],[10,\"tabindex\",[18,\"tabindex\"],null],[10,\"checked\",[25,\"unbound\",[[20,[\"checked\"]]],null],null],[10,\"disabled\",[25,\"unbound\",[[20,[\"disabled\"]]],null],null],[7],[8],[0,\"\\n\"],[6,\"label\"],[7],[1,[18,\"label\"],false],[8],[0,\"\\n\"],[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-radio.hbs" } });
});
define("front-end/templates/components/ui-rating", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "W9sZWSau", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-rating.hbs" } });
});
define("front-end/templates/components/ui-search", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lhs0ScR7", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-search.hbs" } });
});
define("front-end/templates/components/ui-shape", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6fyjvYY6", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-shape.hbs" } });
});
define("front-end/templates/components/ui-sidebar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mqIUyuX+", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-sidebar.hbs" } });
});
define("front-end/templates/components/ui-sticky", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uFd2ZcSQ", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1,[[25,\"action\",[[19,0,[]],\"execute\"],null]]]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/ui-sticky.hbs" } });
});
define("front-end/templates/components/upload-files", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "buOryoFr", "block": "{\"symbols\":[\"file\"],\"statements\":[[4,\"each\",[[20,[\"queue\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"ui divided demo items\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"image\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isUploading\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui loader\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"base64Image\"]]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"middle aligned content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"meta\"],[7],[0,\"\\n          \"],[6,\"span\"],[7],[0,\"Size: \"],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"description\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"            \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"p\"],[7],[0,\"Unsupported image\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"extra\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"            \"],[6,\"button\"],[9,\"class\",\"ui icon green basic button\"],[3,\"action\",[[19,0,[]],\"saveFile\",[19,1,[]]]],[7],[0,\"\\n              \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"          \"],[6,\"button\"],[9,\"class\",\"ui icon red basic button\"],[3,\"action\",[[19,0,[]],\"deleteFile\",[19,1,[]]]],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"ui fluid labeled input\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"ui fluid huge label\"],[10,\"style\",[18,\"labelStyle\"],null],[7],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"big cloud upload icon\"],[7],[8],[0,\"\\n      Click or Drop files into this area to upload files\\n    \"],[8],[0,\"\\n    \"],[6,\"input\"],[9,\"type\",\"file\"],[9,\"value\",\"target.value\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectFile\"],null],null],[10,\"style\",[18,\"inputStyle\"],null],[10,\"accept\",[26,[[18,\"accept\"]]]],[10,\"multiple\",[18,\"multiple\"],null],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"button\"],[9,\"class\",\"ui black button\"],[3,\"action\",[[19,0,[]],\"done\",[20,[\"file\"]]]],[7],[0,\"\\n    Cancel\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"queue\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"savingInProgress\"]]],null,{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"ui labeled green icon loading button\"],[7],[0,\"Loading\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"ui labeled green icon button\"],[3,\"action\",[[19,0,[]],\"saveAllFiles\"]],[7],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n      Save All\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[6,\"button\"],[9,\"class\",\"ui labeled red icon button\"],[3,\"action\",[[19,0,[]],\"deleteAllFiles\"]],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n    Remove All\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/upload-files.hbs" } });
});
define("front-end/templates/components/view-images", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "tQtTmOHu", "block": "{\"symbols\":[\"image\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui blue right floated animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"View Images\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"viewImages\",\"viewImages\"]],{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n    View User's Images\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Size\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Size\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"imageModel\"]]],null,{\"statements\":[[0,\"          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[6,\"img\"],[10,\"src\",[19,1,[\"imageData\"]],null],[7],[8],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n      Finished\\n      \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/view-images.hbs" } });
});
define("front-end/templates/exercise", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "BOs83KQE", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Exercises\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n            \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n                \"],[6,\"thead\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Duration\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tfoot\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Duration\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"tr\"],[7],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"frequency\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"duration\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[0,\"\\n                                \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"image\",\"imageData\"]]]]],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[0,\"\\n                                \"],[1,[25,\"delete-exercise\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[1,[25,\"modify-exercise\",null,[[\"name\",\"description\",\"objectives\",\"actionSteps\",\"frequency\",\"duration\",\"image\",\"ID\"],[[19,1,[\"name\"]],[19,1,[\"description\"]],[19,1,[\"objectives\"]],[19,1,[\"actionSteps\"]],[19,1,[\"frequency\"]],[19,1,[\"duration\"]],[19,1,[\"image\"]],[19,1,[\"id\"]]]]],false],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n    \"],[1,[18,\"add-exercise\"],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/exercise.hbs" } });
});
define("front-end/templates/faq", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "PBZR08xx", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"body\"],[9,\"style\",\"margin-left: 4em\"],[7],[0,\"\\n\"],[6,\"h2\"],[7],[0,\"Frequently Asked Questions\"],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[4,\"ui-accordion\",null,[[\"class\"],[\"styled\"]],{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    How much does a treatment session cost?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"p\"],[9,\"class\",\"transition hidden\"],[7],[0,\"\\n      I am a fee for service provider.  I accept payment via cash, debit  or cheque.  You may have extended insurance which covers the complete or partial cost of treatment.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      I do not bill WSIB.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      I am very aware of the  rising costs in healthcare.  I will try to do the best I can for you in a limited number of treatments.  Generally I see my clients one time weekly.  I will treat the soft tissue or whatever goals we are working on and then provide you with exercises to perform during the week.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      When you are in my clinic for treatment you receive my undivided attention.  I treat only one patient at a time.  I do not pass you off to support staff; I personally provide all of your treatment.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      I take the time required to make lasting change.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      In short, by operating as a fee for service practice, I am able to provide highly specialized treatments that focus upon results.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      Initial  Assessment Rate:  100.00 (60 minutes in duration)\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n      Treatment Rate:  75.00 (45 minutes in duration)\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    How many times per week do I attend?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      Most clients are attending at least 1X weekly for the first few treatments, and then may attend every 2 or 3 weeks for several further sessions.  Treatment is structured according to the client’s needs.\"],[6,\"br\"],[7],[8],[0,\"\\n\\n      Spacing enought time between sessions is important.  The treatment does not end after one gets up from the table, the body needs time to process and heal.  Structural  changes  in the body can take weeks to improve. Often what seems like an acute injury is actually many years of dysfunction layered  in the body.   The goal is to help the body move in the direction of healing.\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    Will my extended benefits cover the cost of physiotherapy treatments?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Every plan is different, please review your benefit booklet or call you plan provider for further information regarding your coverage for a calendar year.\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    Will my extended benefits cover the cost of physiotherapy treatments?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Every plan is different, please review your benefit booklet or call you plan provider for further information regarding your coverage for a calendar year.\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    Can you bill my insurance company directly?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    I am able to bill online for most plans including Green Shield, Great West Life,  Sun Life, Standard Life, Johnson and Dejardins.    Manulife is billed online if you have an account set up to bill directly.\"],[6,\"br\"],[7],[8],[0,\"\\n\\n    I can bill direct for motor vehicle accidents.\"],[6,\"br\"],[7],[8],[0,\"\\n\\n    I do not bill WSIB (workers compensation) claims.\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    What can I do to help myself?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    For manual medicine to be most effective, you also need to be an active participant in your recovery.   Body, mind, emotion and spirit all require nurture and balance.  This can include adequate sleep, exercise or daily movements, dietary changes  and/or lifestyle changes.\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    Can you cure my particular issue?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    Your body is the real healer. I cannot “make” you get better.  I can only cultivate the conditions for health. My role is to help remove the barriers that prevent your body’s healing mechanisms from operating at their fullest functioning.  That being said, I am confident that every client I have worked with would testify to their satisfaction with the results they achieved in working with me.\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n    What exercises are appropriate between sessions?\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n    I may give you  simple movements  as homework which will help to  restore your alignment and function.   If you are already participating in a regular exercise routine, I recommend that you pay close attention to how your body is responding to those exercises.  Generally, I rarely  suggest   limiting your movement as we generally need to move more.  For the heavy strength exercisers,  I do recommend easing off on machine reps and/or  heavy strength training during treatment.\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/faq.hbs" } });
});
define("front-end/templates/fill-injury-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "5CnO9ora", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"script\"],[7],[0,\"\\n $(document).ready(function() {\\n        var table = $('#example').DataTable();\\n      }\\n  );\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left:4em; margin-right:4em\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"injuryForm\"],[7],[0,\"\\n        \"],[6,\"h2\"],[7],[0,\"Fill an Injury Form\"],[8],[0,\"\\n        \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n            \"],[6,\"thead\"],[7],[0,\"\\n                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                    \"],[6,\"th\"],[7],[0,\"Form\"],[8],[0,\"\\n                    \"],[6,\"th\"],[7],[0,\"Complete\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"tfoot\"],[7],[0,\"\\n                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                    \"],[6,\"th\"],[7],[0,\"Form\"],[8],[0,\"\\n                    \"],[6,\"th\"],[7],[0,\"Complete\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"form\",\"name\"]],false],[8],[0,\"\\n                    \"],[6,\"td\"],[7],[0,\"\\n                        \"],[1,[25,\"complete-injury-form\",null,[[\"injuryForm\"],[[19,1,[]]]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/fill-injury-form.hbs" } });
});
define("front-end/templates/forms", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "RBV05pm+", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"admin-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"forms\"],null,{\"statements\":[[0,\"Forms Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"questions\"],null,{\"statements\":[[0,\"Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"injury-forms\"],null,{\"statements\":[[0,\"Injury Forms\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"manage-users\"],null,{\"statements\":[[0,\"Manage Users\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em;\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Manage Forms\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[2,\" need a css change for this modal position \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n            \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n                \"],[6,\"thead\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Administrator\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tfoot\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Administrator\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"tr\"],[7],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"administrator\",\"givenName\"]],false],[0,\" \"],[1,[19,1,[\"administrator\",\"familyName\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[0,\"\\n                                \"],[1,[25,\"delete-form\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[1,[25,\"modify-form\",null,[[\"ID\",\"administrator\",\"name\",\"description\",\"questionsLists\"],[[19,1,[\"id\"]],[19,1,[\"administrator\"]],[19,1,[\"name\"]],[19,1,[\"description\"]],[19,1,[\"questionsLists\"]]]]],false],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[1,[18,\"add-form\"],false],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/forms.hbs" } });
});
define("front-end/templates/generate-reports", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "S1AJdYb0", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"script\"],[9,\"src\",\"https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.3/jspdf.min.js\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em;\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Generate Client Reports\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[2,\" need a css change for this modal position \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n              \"],[6,\"thead\"],[7],[0,\"\\n                  \"],[6,\"tr\"],[7],[0,\"\\n                      \"],[6,\"th\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n                      \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                      \"],[6,\"th\"],[7],[0,\"Generate PDF Report\"],[8],[0,\"\\n                  \"],[8],[0,\"\\n              \"],[8],[0,\"\\n              \"],[6,\"tfoot\"],[7],[0,\"\\n                  \"],[6,\"tr\"],[7],[0,\"\\n                      \"],[6,\"th\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n                      \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                      \"],[6,\"th\"],[7],[0,\"Generate PDF Report\"],[8],[0,\"\\n                  \"],[8],[0,\"\\n              \"],[8],[0,\"\\n              \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"tr\"],[7],[0,\"\\n                          \"],[6,\"td\"],[7],[1,[19,1,[\"userAccount\",\"userAccountName\"]],false],[8],[0,\"\\n                          \"],[6,\"td\"],[7],[1,[19,1,[\"givenName\"]],false],[0,\" \"],[1,[19,1,[\"familyName\"]],false],[8],[0,\"\\n                          \"],[6,\"td\"],[7],[0,\"\\n                            \"],[6,\"a\"],[9,\"href\",\"#\"],[3,\"action\",[[19,0,[]],\"createPDF\",[19,1,[\"givenNname\"]],[19,1,[\"familyName\"]],[19,1,[\"DOB\"]],[19,1,[\"email\"]],[19,1,[\"phone\"]],[19,1,[\"treatments\"]]]],[7],[0,\"Generate Report\"],[8],[0,\"\\n                            \"],[6,\"br\"],[7],[8],[0,\"\\n                             \"],[1,[25,\"client-report\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"],[2,\"\\n      <label>Choose a Client</label>\\n      <br>\\n{{#ui-dropdown class=\\\"search selection left\\\" allowAdditions=true selected=client onChange=(action (mut client)) as |execute mapper|}}\\n          <div class=\\\"default text\\\">Search Clients</div>\\n          <i class=\\\"dropdown icon\\\"></i>\\n          <div class=\\\"menu\\\">\\n              <div data-value=\\\"\\\" class=\\\"item\\\">All Items</div>\\n              {{#each clientModel as |client|}}\\n                  <div class=\\\"item\\\" data-value=\\\"{{client.id}}\\\">\\n                      {{client.givenName}} {{client.familyName}}\\n                  </div>\\n              {{/each}}\\n          </div>\\n      {{/ui-dropdown}} \"],[0,\"\\n\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/generate-reports.hbs" } });
});
define("front-end/templates/home", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZO9OYXIX", "block": "{\"symbols\":[],\"statements\":[[6,\"body\"],[7],[0,\"\\n  \"],[6,\"header\"],[9,\"class\",\"masthead\"],[9,\"style\",\"padding-bottom: 0;\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"text-align: center; align-content: center\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"intro-text\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"intro-lead-in\"],[7],[0,\"Pain Stops Here\"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"intro-heading text-uppercase\"],[7],[0,\"Discover the online solution to pain relief.\"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui positive button\"],[9,\"style\",\"background-color: white; color: #4f9ec7\"],[7],[0,\"\\n          \"],[6,\"a\"],[9,\"href\",\"#services\"],[7],[0,\"\\n             Tell Me More\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[2,\" Services \"],[0,\"\\n  \"],[6,\"section\"],[9,\"id\",\"services\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12 text-center\"],[7],[0,\"\\n          \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"h2\"],[9,\"class\",\"section-heading text-uppercase\"],[7],[0,\"What I Believe\"],[8],[0,\"\\n          \"],[6,\"p\"],[7],[0,\"\\n            I believe movement is life.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe you can heal your body with functional movement patterns.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe it is never to late to create change in a body & it can happen fast.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe your body knows what it needs.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe every system in your body relies on a functional musculoskeletal system.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n            All systems in the body work on movement:\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n            • the heart beats\"],[6,\"br\"],[7],[8],[0,\"\\n            • the lungs breath\"],[6,\"br\"],[7],[8],[0,\"\\n            • the stomach grinds\"],[6,\"br\"],[7],[8],[0,\"\\n            • the colon transports\"],[6,\"br\"],[7],[8],[0,\"\\n            • the blood flows\"],[6,\"br\"],[7],[8],[0,\"\\n            • the nerves conduct\"],[6,\"br\"],[7],[8],[0,\"\\n            • the muscles contract\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            Dis-ease in the body begins when movement is impaired. Restore your proper design for movement and your pain will cease. No fancy machinery or magic pills required; your body already has everything it needs to heal.\\n            \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe you need to trust yourself.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe you need to take responsibility for your present state of health.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            I believe you can become free of your pain.\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"h1\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"question icon\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[2,\" About \"],[0,\"\\n  \"],[6,\"section\"],[9,\"id\",\"about\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12 text-center\"],[7],[0,\"\\n          \"],[6,\"h2\"],[9,\"class\",\"section-heading text-uppercase\"],[7],[0,\"About\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[7],[0,\"Discover what makes us who we are.\"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"padding: 0 15px 0 15px; margin-right:6em; margin-left: 6em\"],[7],[0,\"\\n          \"],[6,\"h3\"],[7],[0,\"\\n            How would you like to understand how the body works, why you\\n            experience pain in the body and help lead you towards a more enjoyable\\n            pain free life?\\n          \"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          Unfortunately, so many people simply don’t understand how the body\\n          works. This leaves them feeling helpless when it comes to treating the pain\\n          they experience in their body.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          How would you like to live pain-free so that you can get back to doing what\\n          you love most?\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          As a physiotherapist for over three decades, I can help.\\n          My name is Stephanie Marcotte & I have helped thousands of people free\\n          themselves from the pain and suffering caused by issues and imbalances\\n          with the musculoskeletal system.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          Your musculoskeletal system is what allows you to move. When it is\\n          working properly, you not only move better, but you move without pain, too.\\n          But, when you have injured or strained this system, you experience pain.\"],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Muscle strains\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Sprains\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Fractures\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Ligament injuries\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Sports injuries\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Acute pain\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Chronic pain\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Post-injury pain\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[9,\"style\",\"margin-bottom: 0\"],[7],[0,\"• Post-surgical pain\"],[8],[6,\"br\"],[7],[8],[0,\"\\n          And while there are plenty of options when it comes to relieving pain with\\n          external treatments (like drugs, braces, supports, exercises, etc.), they\\n          don’t always get to the root of your problem:\\n          Your musculoskeletal system.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          I can help you find and understand the source of your pain based on your\\n          musculoskeletal system. The same system that creates the pain in your\\n          body, can help you recover from your pain. The solution to your pain\\n          actually lies within your own body.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"b\"],[7],[0,\"I know it sounds simple, it is.\"],[8],[6,\"br\"],[7],[8],[0,\"\\n          What if you could do something to help yourself? What if you understood\\n          what your body was communicating and thus could make lasting change.\\n          Changes that would help you move better into your latter years.\\n          I can show you how to tap into your body’s intuitive knowledge, helping you\\n          to better understand the actual source of your pain, so that you can fully\\n          recover from it.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"b\"],[7],[0,\"\\n            It is no longer appropriate to just label pain without actually fixing it.\\n            You deserve better than that!\\n          \"],[8],[6,\"br\"],[7],[8],[0,\"\\n          By learning how to effectively work with your body, you can create lasting\\n          changes, ones that will stay with you for the rest of your life. It all starts with\\n          creating proper design function in your body. Despite what you hear, the\\n          body is in no way, shape, or form weak, frail, or compromised.\\n          In fact, your body is intelligent, adaptive, and fully capable of healing itself!\\n          Your body is an entire unit. You can’t do something to one part of it without\\n          causing repercussions to the body as a hole. That’s why, when you\\n          experience pain, you are actually experiencing a dysfunction in your entire\\n          system.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"b\"],[7],[0,\"Fix the system. Fix the pain.\"],[8],[6,\"br\"],[7],[8],[0,\"\\n          Two amazing observations I have made in the clinic over the years:\"],[6,\"br\"],[7],[8],[0,\"\\n          \"],[6,\"b\"],[7],[0,\"\\n            1. It is never too late to start making lasting changes in your body. Age is\\n            no boundary, it is just a number.\"],[6,\"br\"],[7],[8],[0,\"\\n            2. The body is way more resilient and responsive to change than you ever\\n            thought possible.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n          Do you want to age gracefully, keeping your body in optimal health and\\n          avoiding the myriad of problems associated with getting older?\\n          As your personal pain relief specialist, I can help you discover the beautiful\\n          possibility of living life pain free, no matter your age!\\n          Together we can re-awaken your body’s natural ability to move, overcoming\\n          years (even decades) of misuse, disuse, stress, and trauma. Don’t just live\\n          longer, live better.\\n          \"],[6,\"h4\"],[7],[0,\"\\n            What are you waiting for?\\n            Let’s get started now!\\n          \"],[8],[0,\"\\n          \"],[6,\"h2\"],[7],[6,\"i\"],[7],[0,\"Stephanie Marcotte\"],[8],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"h1\"],[9,\"class\",\"ui horizontal divider\"],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"mail icon\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[2,\" Contact \"],[0,\"\\n  \"],[6,\"section\"],[9,\"id\",\"contact\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12 text-center\"],[7],[0,\"\\n          \"],[6,\"h2\"],[9,\"class\",\"section-heading text-uppercase\"],[7],[0,\"Contact Us\"],[8],[0,\"\\n          \"],[6,\"h3\"],[9,\"class\",\"section-subheading text-muted\"],[7],[0,\"Contact a physiotherapist today.\"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"h3\"],[7],[0,\"\\n          \"],[6,\"i\"],[7],[0,\"\\n            Location\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n          Marcotte Physiotherapy Clinic\"],[6,\"br\"],[7],[8],[0,\"\\n          313 Main St. East, Suite 19\"],[6,\"br\"],[7],[8],[0,\"\\n          Kingsville, ON N9Y 1A7\"],[6,\"br\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"h3\"],[7],[0,\"\\n          \"],[6,\"i\"],[7],[0,\"\\n            Contact Info\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n          Email: \"],[6,\"a\"],[9,\"href\",\"mailto:stephanie@marcottephysio.com\"],[7],[0,\"stephanie@marcottephysio.com\"],[8],[6,\"br\"],[7],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"h3\"],[7],[0,\"\\n          \"],[6,\"i\"],[7],[0,\"\\n            Hours of Operation\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"\\n          Monday-Friday: 9:15am - 4:45pm (Closed for lunch between 12:30pm and 1:30pm)\\n        \"],[8],[0,\"\\n      \"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n      \"],[1,[18,\"contact-form\"],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/home.hbs" } });
});
define("front-end/templates/how-it-works", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "S/wrVGbN", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"body\"],[9,\"style\",\"margin-left: 4em; margin-right: 4em\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"How it Works\"],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    The initial therapy session is a 90-minute video conference. Prior to our video conference, I will\\n    ask you to complete an initial intake form, submit posture photos and perform a simple\\n    movement assessment. The initial intake form will ask you questions about your current\\n    condition. The posture photos are simply four photos of yourself from head to toe and the\\n    movement assessment is a simple series of movements done in standing and sitting.\\n  \"],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    During the consultation we will review your therapy goals, discuss your condition in greater\\ndetail, and perform some simple movements. I will help you understand your condition and\\nprovide a movement sequence that will help alleviate pain. After consultation, a movement\\nsequence will be uploaded to your account, where you can view your sequence at any time.\\nIdeally, you will perform your movement sequence once daily. The sequence will be\\napproximately 20-30 minutes in duration.\\n  \"],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    Follow up sessions are approximately 45 minutes in length and could be scheduled weekly for\\nthe first 3 weeks. After that point, you may schedule every 2-3 weeks. Learning how to\\nperform the movement sequence correctly is essential. The movements are easy and inherent\\nto your bodies’ natural design. The sessions will help you understand why you are performing\\na particular sequence of movement.\\n  \"],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    The number of sessions that are required varies from individual to individual. On average, 3\\nsessions as a minimum and up to 8 sessions. You are are in control of how frequent you wish\\nto schedule your followup appointments. \\n  \"],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    If you have any further questions, please feel free to contact me via email.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    Thanks, \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n    Stephanie\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/how-it-works.hbs" } });
});
define("front-end/templates/injury-forms", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jJnGtjvv", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"admin-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"forms\"],null,{\"statements\":[[0,\"Forms Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"questions\"],null,{\"statements\":[[0,\"Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"injury-forms\"],null,{\"statements\":[[0,\"Injury Forms\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"manage-users\"],null,{\"statements\":[[0,\"Manage Users\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em; margin-right:4em\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Injury Forms\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n              \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n              \"],[6,\"th\"],[7],[0,\"Form\"],[8],[0,\"\\n              \"],[6,\"th\"],[7],[0,\"Delete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n              \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n              \"],[6,\"th\"],[7],[0,\"Form\"],[8],[0,\"\\n              \"],[6,\"th\"],[7],[0,\"Delete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                \"],[6,\"tr\"],[7],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                    \"],[6,\"td\"],[7],[1,[19,1,[\"form\",\"name\"]],false],[8],[0,\"\\n                    \"],[6,\"td\"],[7],[0,\"\\n                        \"],[1,[25,\"delete-injury-form\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[1,[18,\"add-injury-form\"],false],[0,\"\\n\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/injury-forms.hbs" } });
});
define("front-end/templates/log-out", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gJ3mcCYg", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/log-out.hbs" } });
});
define("front-end/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8JlQn9TC", "block": "{\"symbols\":[],\"statements\":[[6,\"head\"],[7],[0,\"\\n  \"],[6,\"link\"],[9,\"href\",\"https://fonts.googleapis.com/css?family=Krona+One\"],[9,\"rel\",\"stylesheet\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui container\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"style\",\"width:50%; margin: auto\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"border-radius:2%; padding-left:2em; padding-right: 2em\"],[7],[0,\"\\n            \"],[6,\"h2\"],[9,\"style\",\"font-family:'Krona One'; text-align: center; padding-top:1em; font-size:15px\"],[7],[6,\"b\"],[7],[0,\"ALREADY HAVE AN ACCOUNT?\"],[8],[8],[0,\"\\n            \"],[1,[18,\"login-user\"],false],[0,\"\\n            \"],[1,[18,\"forgot-password\"],false],[0,\"\\n        \"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"text-align: center; border-radius:2%; padding-left:2em; padding-right: 2em; margin-bottom: 2em\"],[7],[0,\"\\n          \"],[6,\"div\"],[7],[0,\"\\n            \"],[6,\"h2\"],[9,\"style\",\"font-family:'Krona One'; text-align: center; padding-top: 1em; font-size:15px\"],[7],[0,\"ARE YOU NEW TO SELF START BODY SMART, AND WANT TO BECOME A PART OF IT?\"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"header\"],[9,\"style\",\"font-family:'Krona One'; text-align: center; font-size:22px\"],[7],[0,\"\\n              REGISTER\\n            \"],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[1,[18,\"register-user\"],false],[0,\"\\n          \"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"style\",\"text-align: center;\"],[7],[0,\"\\n            \"],[6,\"p\"],[9,\"style\",\"font-family:'Krona One'; font-size:12px;\"],[7],[0,\"\\n                After registering, please check your email for the authentication code to get\\n                started!\\n            \"],[8],[0,\"\\n            \"],[1,[18,\"authenticate-user\"],false],[0,\"\\n        \"],[8],[0,\"\\n          \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[1,[18,\"generate-data\"],false]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/login.hbs" } });
});
define("front-end/templates/make-payment", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ImqrEFln", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"book-appointment\"],null,{\"statements\":[[0,\"Book Appointment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"make-payment\"],null,{\"statements\":[[0,\"Make Payment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"treatments\"],null,{\"statements\":[[0,\"Treatments\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"my-images\"],null,{\"statements\":[[0,\"My Uploaded Images\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"body\"],[7],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"style\",\"margin-left:4em\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Make Payment\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[1,[18,\"create-payment\"],false],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/make-payment.hbs" } });
});
define("front-end/templates/manage-users", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "EaVkvRto", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"admin-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"forms\"],null,{\"statements\":[[0,\"Forms Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"questions\"],null,{\"statements\":[[0,\"Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"injury-forms\"],null,{\"statements\":[[0,\"Injury Forms\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"manage-users\"],null,{\"statements\":[[0,\"Manage Users\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em;\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"Disable/Enable Accounts\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[2,\" need a css change for this modal position \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Username\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Role\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Status\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Modify\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Enable/Disable\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Username\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Role\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Status\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Modify\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Enable/Disable\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n              \"],[6,\"td\"],[7],[1,[19,1,[\"userAccountName\"]],false],[8],[0,\"\\n\"],[4,\"if\",[[19,1,[\"role\",\"isPatientProfile\"]]],null,{\"statements\":[[0,\"                \"],[6,\"td\"],[7],[0,\"\\n                  Patient Profile\\n                \"],[8],[0,\"\\n\"],[4,\"if\",[[19,1,[\"patientProfile\",\"enabled\"]]],null,{\"statements\":[[0,\"                  \"],[6,\"td\"],[7],[0,\"\\n                    Enabled\\n                  \"],[8],[0,\"\\n                  \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"ui red button\"],[3,\"action\",[[19,0,[]],\"enableUser\",[19,1,[\"patientProfile\",\"id\"]]]],[7],[0,\"\\n                      Disable\\n                    \"],[8],[0,\"\\n                  \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                  \"],[6,\"td\"],[7],[0,\"\\n                    Disabled\\n                  \"],[8],[0,\"\\n                  \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"ui green button\"],[3,\"action\",[[19,0,[]],\"enableUser\",[19,1,[\"patientProfile\",\"id\"]]]],[7],[0,\"\\n                      Enable\\n                    \"],[8],[0,\"\\n                  \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[1,[25,\"modify-client-profile\",null,[[\"ID\"],[[19,1,[\"patientProfile\",\"id\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[19,1,[\"role\",\"isPhysiotherapist\"]]],null,{\"statements\":[[0,\"                  \"],[6,\"td\"],[7],[0,\"\\n                    Physiotherapist\\n                  \"],[8],[0,\"\\n\"],[4,\"if\",[[19,1,[\"physiotherapist\",\"enabled\"]]],null,{\"statements\":[[0,\"                  \"],[6,\"td\"],[7],[0,\"\\n                    Enabled\\n                  \"],[8],[0,\"\\n                  \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"ui red button\"],[3,\"action\",[[19,0,[]],\"enablePhysio\",[19,1,[\"physiotherapist\",\"id\"]]]],[7],[0,\"\\n                      Disable\\n                    \"],[8],[0,\"\\n                    \"],[1,[18,\"appt-button\"],false],[0,\"\\n                  \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                  \"],[6,\"td\"],[7],[0,\"\\n                    Disabled\\n                  \"],[8],[0,\"\\n                  \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"ui green button\"],[3,\"action\",[[19,0,[]],\"enablePhysio\",[19,1,[\"physiotherapist\",\"id\"]]]],[7],[0,\"\\n                      Enable\\n                    \"],[8],[0,\"\\n                    \"],[1,[18,\"appt-button\"],false],[0,\"\\n                  \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[1,[25,\"modify-physio-profile\",null,[[\"ID\",\"byAdmin\"],[[19,1,[\"physiotherapist\",\"id\"]],true]]],false],[0,\"\\n                \"],[8],[0,\"\\n              \"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em\"],[7],[0,\"\\n  \"],[6,\"h3\"],[7],[0,\"Create Accounts\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"style\",\"display: inline-block\"],[7],[0,\"\\n    \"],[1,[18,\"register-physiotherapist\"],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"style\",\"display: inline-block\"],[7],[0,\"\\n    \"],[1,[18,\"register-admin\"],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"style\",\"display: inline-block\"],[7],[0,\"\\n    \"],[1,[18,\"register-user\"],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/manage-users.hbs" } });
});
define("front-end/templates/my-images", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "aiXZvKN9", "block": "{\"symbols\":[\"image\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"book-appointment\"],null,{\"statements\":[[0,\"Book Appointment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"make-payment\"],null,{\"statements\":[[0,\"Make Payment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"treatments\"],null,{\"statements\":[[0,\"Treatments\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"my-images\"],null,{\"statements\":[[0,\"My Uploaded Images\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em; margin-right: 4em\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"My Uploaded Images\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Size\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Delete\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Size\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Delete\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[6,\"img\"],[10,\"src\",[19,1,[\"imageData\"]],null],[7],[8],[8],[0,\"\\n            \"],[6,\"td\"],[7],[0,\"\\n              \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"deleteImage\",[19,1,[\"id\"]]]],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                  \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Delete\"],[8],[0,\"\\n              \"],[8],[0,\"\\n              \"],[1,[18,\"appt-button\"],false],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/my-images.hbs" } });
});
define("front-end/templates/patient-images", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "OW2ydwof", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n  \"],[6,\"h2\"],[7],[0,\"User's Images\"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n      \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Last Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"First Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Email\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"View Images\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Last Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"First Name\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Email\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"View Images\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"          \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"familyName\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"givenName\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[19,1,[\"email\"]],false],[8],[0,\"\\n            \"],[6,\"td\"],[7],[1,[25,\"view-images\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/patient-images.hbs" } });
});
define("front-end/templates/patient-profiles", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JkVrk6Dn", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em;\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Assign Rehabilitation Plans\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[2,\" need a css change for this modal position \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n            \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n                \"],[6,\"thead\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Email\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Assign Rehabilitation Plan\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tfoot\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Email\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Assign Rehabilitation Plan\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"tr\"],[7],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"givenName\"]],false],[0,\" \"],[1,[19,1,[\"familyName\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"email\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[25,\"assign-plan\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/patient-profiles.hbs" } });
});
define("front-end/templates/physio-completed-injury-forms", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "J8F2WFOo", "block": "{\"symbols\":[\"completedInjuryForm\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em; margin-right: 4em\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Completed Injury Forms\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n            \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n                \"],[6,\"thead\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Email\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Injury Form Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"View\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tfoot\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Email\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Injury Form Name\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"View\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"tr\"],[7],[0,\"\\n                      \"],[6,\"td\"],[7],[1,[19,1,[\"email\"]],false],[8],[0,\"\\n                      \"],[6,\"td\"],[7],[1,[19,1,[\"injuryForm\",\"name\"]],false],[8],[0,\"\\n                      \"],[6,\"td\"],[7],[0,\"\\n                        \"],[1,[25,\"show-injury-form\",null,[[\"ID\",\"completedInjuryForm\"],[[19,1,[\"id\"]],[19,1,[]]]]],false],[0,\"\\n                      \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"script\"],[7],[0,\"\\n$(document).ready(function() {\\n       var table = $('#example').DataTable();\\n     }\\n );\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/physio-completed-injury-forms.hbs" } });
});
define("front-end/templates/physio-profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ziyc1KHK", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em; margin-right: 4em\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[1,[20,[\"model\",\"givenName\"]],false],[0,\" \"],[1,[20,[\"model\",\"familyName\"]],false],[8],[0,\"\\n    \"],[6,\"h4\"],[7],[0,\"User Account Name\"],[8],[0,\"\\n    \"],[1,[20,[\"model\",\"userAccount\",\"userAccountName\"]],false],[0,\"\\n    \"],[6,\"h4\"],[7],[0,\"Email\"],[8],[0,\"\\n    \"],[1,[20,[\"model\",\"email\"]],false],[0,\"\\n    \"],[6,\"h4\"],[7],[0,\"Date Hired\"],[8],[0,\"\\n    \"],[1,[20,[\"model\",\"dateHired\"]],false],[0,\"\\n    \"],[6,\"br\"],[7],[8],[0,\"\\n    \"],[1,[25,\"modify-physio-profile\",null,[[\"ID\",\"byAdmin\"],[[20,[\"model\",\"id\"]],false]]],false],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/physio-profile.hbs" } });
});
define("front-end/templates/questions", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rMwAcIdr", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"admin-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"forms\"],null,{\"statements\":[[0,\"Forms Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"questions\"],null,{\"statements\":[[0,\"Questions\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"injury-forms\"],null,{\"statements\":[[0,\"Injury Forms\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"manage-users\"],null,{\"statements\":[[0,\"Manage Users\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em;\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Manage Questions\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[2,\" need a css change for this modal position \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[9,\"style\",\"margin: 30px;\"],[7],[0,\"\\n            \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n                \"],[6,\"thead\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Question Text\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Help Description\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Type\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tfoot\"],[7],[0,\"\\n                    \"],[6,\"tr\"],[7],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Question Text\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Help Description\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Type\"],[8],[0,\"\\n                        \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"tr\"],[7],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"questionText\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"helpDescription\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[1,[19,1,[\"questionType\"]],false],[8],[0,\"\\n                            \"],[6,\"td\"],[7],[0,\"\\n                                \"],[1,[25,\"delete-question\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[1,[25,\"modify-question\",null,[[\"questionText\",\"helpDescription\",\"order\",\"questionType\",\"ID\"],[[19,1,[\"questionText\"]],[19,1,[\"helpDescription\"]],[19,1,[\"order\"]],[19,1,[\"questionType\"]],[19,1,[\"id\"]]]]],false],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[1,[18,\"add-question\"],false],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/questions.hbs" } });
});
define("front-end/templates/rehab-plans", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "7FTulPTO", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"script\"],[7],[0,\"\\n $(document).ready(function() {\\n        var table = $('#example').DataTable();\\n      }\\n  );  \\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n        \"],[4,\"link-to\",[\"physio-profile\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-profiles\"],null,{\"statements\":[[0,\"Assign Rehabilitation Plans\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"physio-completed-injury-forms\"],null,{\"statements\":[[0,\"Completed Injury Forms\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"patient-images\"],null,{\"statements\":[[0,\"User's Images\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"appointments\"],null,{\"statements\":[[0,\"Upcoming Appointments\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"generate-reports\"],null,{\"statements\":[[0,\"Generate Patient Reports\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Plans\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-lg-12\"],[7],[0,\"\\n    \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Goal\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Time Frame To Complete\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Goal\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Time Frame To Complete\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Edit/Delete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"goal\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"timeFrameToComplete\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[25,\"delete-plan\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[1,[25,\"modify-plan\",null,[[\"name\",\"description\",\"physiotherapist\",\"timeFrameToComplete\",\"goal\",\"exercisesLists\",\"assessmentTests\",\"exercisesLists\",\"ID\"],[[19,1,[\"name\"]],[19,1,[\"description\"]],[19,1,[\"physiotherapist\"]],[19,1,[\"timeFrameToComplete\"]],[19,1,[\"goal\"]],[19,1,[\"exercisesLists\"]],[19,1,[\"assessmentTests\"]],[19,1,[\"exercisesLists\"]],[19,1,[\"id\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[1,[18,\"add-new-plan\"],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/rehab-plans.hbs" } });
});
define("front-end/templates/services", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "sRJxLkfI", "block": "{\"symbols\":[],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"body\"],[9,\"style\",\"margin-left: 4em\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Services\"],[8],[0,\"\\n    \"],[6,\"h3\"],[7],[0,\"Whether you have come here seeking…\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n        \"],[6,\"ul\"],[7],[0,\"\\n            \"],[6,\"li\"],[7],[0,\"A solution to a chronic pain problem\"],[8],[0,\"\\n            \"],[6,\"li\"],[7],[0,\"Help recovering from an injury\"],[8],[0,\"\\n            \"],[6,\"li\"],[7],[0,\"To achieve a higher level of physical performance\"],[8],[0,\"\\n            \"],[6,\"li\"],[7],[0,\"Improved overall health\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"h4\"],[7],[0,\"I can help you reach your goals.\"],[8],[6,\"br\"],[7],[8],[0,\"\\n        At Marcotte Physiotherapy Clinic, you will experience a gradual re-awakening of your body’s need for movement. Your body was designed to move and move often.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        Misuse, disuse, stress and trauma of the body passes unnoticed until we experience physical pain. Pain is the message the body uses to communicate with you. Pain gets you to ACT. No need to fear the pain, it is simply the messenger of dysfunction and/or malalignment in the body.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        At my clinic, I want to help you understand the design of the body and how it functions. The physical symptoms you experience are the direct result of injury and/or postural dysfunction.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        An injury does not mean you have to live in chronic pain. The body heals, it will move forward in life; you need to move beyond the fear and recapture the joy in life. Daily use of our body and mind in meaningful ways maintains both the structure and function of the body.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        Successful treatment requries a commitment on your part, it means taking responsibility for your present state of health and taking the time to make positive changes in your lifestyle. My commitment to you is compassionate care.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        The body is an amazing self healing organism. If you have the desire, I can show you the way to living pain free.\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        Your health is your wealth…..Let’s get started!\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n        \"],[6,\"h4\"],[7],[0,\"Stephanie Marcotte (registered physiotherapist)\"],[6,\"br\"],[7],[8],[0,\"\\n        (BSc.PT, BA)\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Treatment Package Options\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"style\",\"text-align: center\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center; padding-top: 28px\"],[7],[0,\"\\n            \"],[6,\"h3\"],[7],[0,\"Assessment Package\"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Initial consult via email and video conference\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Personal online account Therapy Plan - accessed on your account\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Education, Advice\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"b\"],[7],[0,\"$150\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center\"],[7],[0,\"\\n            \"],[6,\"h3\"],[7],[0,\"Assessment Package + 3 Sessions\"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Initial consult via email and video conference\"],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"3 further online sessions via email and video conference\"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Personal online account Therapy Plan - accessed on your account\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Education, Advice\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"b\"],[7],[0,\"$350\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui raised segment\"],[9,\"style\",\"display: inline-block; text-align:center\"],[7],[0,\"\\n            \"],[6,\"h3\"],[7],[0,\"Assessment Package + 6 Sessions\"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Initial consult via email and video conference\"],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"6 further online sessions via email and video conference\"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Personal online account Therapy Plan - accessed on your account\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"Education, Advice\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"b\"],[7],[0,\"$550\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[6,\"b\"],[7],[0,\"*Single Follow-up Appointments within 3 months of initial consusltation - $75\"],[8],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/services.hbs" } });
});
define("front-end/templates/treatments", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "TAVDNx6Q", "block": "{\"symbols\":[\"treatment\",\"assessmentTest\",\"exercisesList\",\"objective\",\"actionStep\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui secondary pointing menu\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"clients\"],null,{\"statements\":[[0,\"Profile\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"book-appointment\"],null,{\"statements\":[[0,\"Book Appointment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"make-payment\"],null,{\"statements\":[[0,\"Make Payment\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"active item\"],[7],[4,\"link-to\",[\"treatments\"],null,{\"statements\":[[0,\"Treatments\"]],\"parameters\":[]},null],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[4,\"link-to\",[\"my-images\"],null,{\"statements\":[[0,\"My Uploaded Images\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"style\",\"margin-left: 4em\"],[7],[0,\"\\n  \"],[6,\"h1\"],[7],[0,\"Treatments\"],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[4,\"ui-accordion\",null,[[\"class\",\"style\"],[\"styled\",\"width: 50%\"]],{\"statements\":[[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"title\"],[7],[0,\"\\n        \"],[1,[19,1,[\"rehabilitationPlan\",\"name\"]],false],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n        \"],[6,\"h2\"],[7],[0,\"Exercises\"],[8],[0,\"\\n        \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n          \"],[6,\"thead\"],[7],[0,\"\\n              \"],[6,\"tr\"],[7],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Action Steps\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Objectives\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Duration\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n              \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"tfoot\"],[7],[0,\"\\n              \"],[6,\"tr\"],[7],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Action Steps\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Objectives\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Duration\"],[8],[0,\"\\n                  \"],[6,\"th\"],[7],[0,\"Image\"],[8],[0,\"\\n              \"],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"rehabilitationPlan\",\"exercisesLists\"]]],null,{\"statements\":[[0,\"              \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,3,[\"exercise\",\"name\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,3,[\"exercise\",\"description\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[19,3,[\"exercise\",\"actionSteps\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"li\"],[7],[1,[19,5,[]],false],[8],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"                  \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[19,3,[\"exercise\",\"objectives\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"li\"],[7],[1,[19,4,[]],false],[8],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"                  \"],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[1,[19,3,[\"exercise\",\"frequency\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[1,[19,3,[\"exercise\",\"duration\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                  \"],[6,\"img\"],[10,\"src\",[26,[[19,3,[\"exercise\",\"image\",\"imageData\"]]]]],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n              \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"          \"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"h2\"],[7],[0,\"Assessment Tests\"],[8],[0,\"\\n        \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"rehabilitationPlan\",\"assessmentTests\"]]],null,{\"statements\":[[0,\"            \"],[6,\"li\"],[7],[0,\"\\n              \"],[1,[19,2,[\"form\",\"name\"]],false],[0,\" \"],[1,[25,\"complete-test\",null,[[\"assessmentTest\",\"treatment\"],[[19,2,[]],[19,1,[]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/treatments.hbs" } });
});
define('front-end/utils/file-object', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Object.extend({
    // Name is used for the upload property
    name: '',

    // {Property} Human readable size of the selected file
    size: "0 KB",

    // {Property} Raw file size of the selected file
    rawSize: 0,

    // {Property} Indicates if this file is an image we can display
    isDisplayableImage: false,

    // {Property} String representation of the file
    base64Image: '',

    // {Property} Will be an HTML5 File
    fileToUpload: null,

    // {Property} The acceptable file size in MB
    maximumFileSize: 5,

    // {Property} If a file is currently being uploaded
    isUploading: false,

    // {Property} If the file was uploaded successfully
    isUploaded: false,

    humanReadableFileSize: function humanReadableFileSize(size) {
      var label = "";
      if (size == 0) {
        label = "0 KB";
      } else if (size && !isNaN(size)) {
        var fileSizeInBytes = size;
        var i = -1;
        do {
          fileSizeInBytes = fileSizeInBytes / 1024;
          i++;
        } while (fileSizeInBytes > 1024);

        var byteUnits = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
        label += Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
      }
      return label;
    },

    readFile: function readFile() {
      var self = this;
      this.set('isUploading', true);
      this.set('isUploaded', false);
      var fileToUpload = this.get('fileToUpload');
      var isImage = fileToUpload.type.indexOf('image') === 0;

      this.set('name', fileToUpload.name);
      this.set('type', fileToUpload.type);
      this.set('rawSize', fileToUpload.size);
      this.set('size', self.humanReadableFileSize(fileToUpload.size));

      // Create a reader and read the file.
      var reader = new FileReader();
      reader.onprogress = function () {
        self.set('isUploading', true);
        self.set('isUploaded', false);
      };
      reader.onloadend = function (event) {
        self.set('base64Image', event.target.result);
        self.set('isUploading', false);
        self.set('isUploaded', true);
      };
      this.set('isDisplayableImage', false);
      self.set('isUploading', false);
      self.set('isUploaded', true);
      if (isImage) {
        // Don't read anything bigger than 5 MB
        var maxSize = 5 * 1024 * 1024;
        if (fileToUpload.size <= maxSize) {
          this.set('isDisplayableImage', true);
          // Read in the image file from the file explorer.
          reader.readAsDataURL(fileToUpload);
        } else {
          console.log("This is not an acceptable image");
          // Read in the error image file.
          self.set('base64Image', '/assets/images/square-image.png');
        }
      } else {
        console.log("This is not an acceptable image");
        // not an image
        self.set('base64Image', '/assets/images/square-image.png');
      }
    },
    init: function init() {
      this._super.apply(this, arguments);
      this.readFile();
    }
  });
});
define('front-end/utils/get-promise-content', ['exports', 'ember-promise-tools/utils/get-promise-content'], function (exports, _getPromiseContent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _getPromiseContent.default;
    }
  });
});
define('front-end/utils/is-fulfilled', ['exports', 'ember-promise-tools/utils/is-fulfilled'], function (exports, _isFulfilled) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isFulfilled.default;
    }
  });
});
define('front-end/utils/is-promise', ['exports', 'ember-promise-tools/utils/is-promise'], function (exports, _isPromise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isPromise.default;
    }
  });
});
define('front-end/utils/smart-resolve', ['exports', 'ember-promise-tools/utils/smart-resolve'], function (exports, _smartResolve) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _smartResolve.default;
    }
  });
});


define('front-end/config/environment', [], function() {
  var prefix = 'front-end';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("front-end/app")["default"].create({"name":"front-end","version":"0.0.0+915e96fb"});
}
//# sourceMappingURL=front-end.map
