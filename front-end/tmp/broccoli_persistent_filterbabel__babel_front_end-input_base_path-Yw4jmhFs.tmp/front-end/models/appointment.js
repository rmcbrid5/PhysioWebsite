import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr('date'),
    reason: DS.attr('string'),
    other: DS.attr('string'),
    patientProfile: DS.attr('string')
});
