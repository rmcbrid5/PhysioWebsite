import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    form: DS.attr('string'),
    rehabilitationPlan: DS.attr('string'),
    recommendations: DS.attr(),
    testResults: DS.attr()
});