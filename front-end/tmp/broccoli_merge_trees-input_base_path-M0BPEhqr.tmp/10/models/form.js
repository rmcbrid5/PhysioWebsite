import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
	description: DS.attr('string'),
	administrator: DS.attr('string'),
	assessmentTests: DS.attr(),
	questionsLists: DS.attr(),
	injuryForms: DS.attr()
});