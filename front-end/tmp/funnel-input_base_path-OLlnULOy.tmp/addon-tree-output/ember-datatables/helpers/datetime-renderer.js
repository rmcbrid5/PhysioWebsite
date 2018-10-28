define('ember-datatables/helpers/datetime-renderer', ['exports', 'ember'], function (exports, _ember) {
  exports.datetimeRenderer = datetimeRenderer;

  function datetimeRenderer(params /*, hash*/) {
    return _ember['default'].$.fn.dataTable.render.moment.apply(null, params);
  }

  exports['default'] = _ember['default'].Helper.helper(datetimeRenderer);
});