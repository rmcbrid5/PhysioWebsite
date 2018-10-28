import DS from 'ember-data';

export default DS.Model.extend({
    question: DS.attr('string'),
    answer: DS.attr('string'),
    assessmentTest: DS.attr('string'),
    treatment: DS.attr('string')
});
