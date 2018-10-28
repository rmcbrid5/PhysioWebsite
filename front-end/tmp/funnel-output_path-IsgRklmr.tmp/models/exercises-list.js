import DS from 'ember-data';

export default DS.Model.extend({
    rehabilitationPlan: DS.attr('string'),
    exercise: DS.attr('string')
});
