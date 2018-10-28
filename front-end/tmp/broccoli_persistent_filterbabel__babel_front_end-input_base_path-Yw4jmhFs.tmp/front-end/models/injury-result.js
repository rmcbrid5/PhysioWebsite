import DS from 'ember-data';

export default DS.Model.extend({
    questionText: DS.attr('string'),
    answer: DS.attr('string'),
    completedInjuryForm: DS.attr('string')
});
