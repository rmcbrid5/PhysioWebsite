import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    form: DS.attr('string'),
    completedInjuryForms: DS.attr()
});
