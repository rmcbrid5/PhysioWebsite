import Ember from 'ember';
import layout from '../templates/components/data-table';

export default Ember.Component.extend({
  layout,

  tagName: 'table',

  data: null,
  columns: null,
  columnDefs: null,

  paging: null,
  ordering: null,
  info: null,

  didInsertElement() {
    let options = {};

    let models = this.get('data');
    if (null !== models) {
      options.ajax = function(data, callback) {
        callback({data: models.toArray()});
      };
    }

    let columns = this.get('columns');
    function getColumnValue(row, type, set, meta) {
      return row.get(columns[meta.col].property);
    }

    if (null !== columns) {

      for (let column of columns) {
        column.data = getColumnValue;
      }

      options.columns = columns;
    }

    let setOption = (name) => {
      let value = this.get(name);
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
