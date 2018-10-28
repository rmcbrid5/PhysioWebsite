import Component from '@ember/component';

export default Component.extend({
    store: Ember.inject.service(),
    assessmentTestModel: Ember.computed(function(){
        return this.get('store').findAll('assessment-test');
    }),
    actions: {
        addAssessmentTest: function(value){
            // Selected an assessment test that has already been chosen
            if(this.chosenAssessmentTests.contains(value)){
                this.chosenAssessmentTests.splice(this.chosenAssessmentTests.indexOf(value), 1);
                this.$('#list').empty();
                for(var i = 0; i < this.chosenAssessmentTests.length; i++){
                    this.$('#list').append('<li>' + value + '</li>');
                }
            }
            // Selected a new assessment test
            else{
                this.chosenAssessmentTests.push(value);
                this.$('#list').append('<li>' + value + '</li>');
            }
        }
    },
    chosenAssessmentTests: []
});