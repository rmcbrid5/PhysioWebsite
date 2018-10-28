import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr('string'),
    date: DS.attr('date'),
    injuryForm: DS.attr('string'),
    injuryResults: DS.attr()
});
