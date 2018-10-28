import DS from 'ember-data';

export default DS.Model.extend({
    dayTimeStamp: DS.attr('date'),
    amount: DS.attr('number'),
    note: DS.attr('string'),
    patientProfile: DS.attr('string')
});
