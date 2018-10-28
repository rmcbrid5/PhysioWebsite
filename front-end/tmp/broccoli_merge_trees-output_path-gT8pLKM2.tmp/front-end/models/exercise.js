import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    objectives: DS.attr(),
    actionSteps: DS.attr(),
    frequency: DS.attr('number'),
    duration: DS.attr('number'),
    exercisesLists: DS.attr(),
    image: DS.attr('string')
});