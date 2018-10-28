import DS from 'ember-data';

export default DS.Model.extend({
    dateAssigned: DS.attr('string'),
    physiotherapist: DS.attr('string'),
    rehabilitationPlan: DS.attr('string'),
    patientProfile: DS.attr('string'),
    recommendations: DS.attr(),
    testResutls: DS.attr()
});
