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