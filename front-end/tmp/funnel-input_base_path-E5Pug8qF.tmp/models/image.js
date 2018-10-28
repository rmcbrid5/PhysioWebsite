import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  type: DS.attr(),
  size: DS.attr(),
  rawSize: DS.attr('number'),
  imageData: DS.attr(),
  patientProfile: DS.attr('string'),
  exercise: DS.attr('string')
});