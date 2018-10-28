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