define('ember-datatables/components/data-table', ['exports', 'ember', 'ember-datatables/templates/components/data-table'], function (exports, _ember, _emberDatatablesTemplatesComponentsDataTable) {
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberDatatablesTemplatesComponentsDataTable['default'],

    tagName: 'table',

    data: null,
    columns: null,
    columnDefs: null,

    paging: null,
    ordering: null,
    info: null,

    didInsertElement: function didInsertElement() {
      var _this = this;

      var options = {};

      var models = this.get('data');
      if (null !== models) {
        options.ajax = function (data, callback) {
          callback({ data: models.toArray() });
        };
      }

      var columns = this.get('columns');
      function getColumnValue(row, type, set, meta) {
        return row.get(columns[meta.col].property);
      }

      if (null !== columns) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {

          for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var column = _step.value;

            column.data = getColumnValue;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        options.columns = columns;
      }

      var setOption = function setOption(name) {
        var value = _this.get(name);
        if (null !== value) {
          options[name] = value;
        }
      };
      setOption('columnDefs');
      setOption('info');
      setOption('ordering');
      setOption('paging');

      this.$().DataTable(options);
    }
  });
});