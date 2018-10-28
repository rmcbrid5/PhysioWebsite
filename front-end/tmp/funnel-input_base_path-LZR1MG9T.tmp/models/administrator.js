import DS from 'ember-data';

export default DS.Model.extend({
    familyName: DS.attr('string'),
    givenName: DS.attr('string'),
    email: DS.attr('string'),
    userAccount: DS.attr('string'),
    dateHired: DS.attr('date'),
    dateFinished: DS.attr('date'),
    forms: DS.attr(),
    enabled: DS.attr('boolean')
});
