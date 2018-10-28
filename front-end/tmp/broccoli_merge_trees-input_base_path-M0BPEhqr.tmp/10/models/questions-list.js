import DS from 'ember-data';

export default DS.Model.extend({
    form: DS.attr('string'),
    question: DS.attr('string')
});
