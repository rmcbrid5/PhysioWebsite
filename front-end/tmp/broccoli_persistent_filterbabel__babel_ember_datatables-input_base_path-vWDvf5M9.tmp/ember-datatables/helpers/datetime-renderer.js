import Ember from 'ember';

export function datetimeRenderer(params/*, hash*/) {
  return Ember.$.fn.dataTable.render.moment.apply(null, params);
}

export default Ember.Helper.helper(datetimeRenderer);
