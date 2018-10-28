import DS from 'ember-data';

export default DS.Model.extend({
    questionText: DS.attr('string'),
    helpDescription: DS.attr('string'),
    questionType: DS.attr(),
    questionsLists: DS.attr()
});
