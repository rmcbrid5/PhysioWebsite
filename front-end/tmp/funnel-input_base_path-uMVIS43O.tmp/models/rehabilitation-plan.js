import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    physiotherapist: DS.attr('string'),
    goal: DS.attr('string'),
    exercisesLists: DS.attr(),
    assessmentTests: DS.attr(),
    treatments: DS.attr()
});
