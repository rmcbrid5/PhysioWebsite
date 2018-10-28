import DS from 'ember-data';

export default DS.Model.extend({
    familyName: DS.attr('string'),
    givenName: DS.attr('string'),
    email: DS.attr('string'),
    userAccount: DS.attr('string'),
    DOB: DS.attr('date'),
    postalCode: DS.attr('string'),
    phone: DS.attr('string'),
    country: DS.attr('string'),
    province: DS.attr('string'),
    city: DS.attr('string'),
    gender: DS.attr('string'),
    appointments: DS.attr(),
    treatments: DS.attr(),
    payments: DS.attr(),
    images: DS.attr(),
    enabled: DS.attr('boolean')
});