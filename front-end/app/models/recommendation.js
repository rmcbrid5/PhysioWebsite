import DS from 'ember-data';

export default DS.Model.extend({
    timeStamp: DS.attr('date'),
    decision: DS.attr('string'),
    assessmentTest: DS.attr('string'),
    treatment: DS.attr('string')
});
