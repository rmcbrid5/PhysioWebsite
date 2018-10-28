define("front-end/templates/assessment-tests", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "kZljFF11", "block": "{\"symbols\":[\"onePost\"],\"statements\":[[6,\"link\"],[9,\"rel\",\"stylesheet\"],[9,\"href\",\"https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css\"],[7],[8],[0,\"\\n\"],[6,\"script\"],[7],[0,\"\\n $(document).ready(function() {\\n        var table = $('#example').DataTable();\\n      }\\n  );\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui tabular menu\"],[7],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"exercise\"],null,{\"statements\":[[0,\"Exercises\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"item\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"rehab-plans\"],null,{\"statements\":[[0,\"Create a Plan\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"a\"],[9,\"class\",\"active item\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"assessment-tests\"],null,{\"statements\":[[0,\"Complete Assessment Test\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"rehabPlan\"],[7],[0,\"\\n    \"],[6,\"h2\"],[7],[0,\"Assesment Tests\"],[8],[0,\"\\n    \"],[6,\"table\"],[9,\"id\",\"example\"],[9,\"class\",\"ui celled table\"],[9,\"width\",\"100%\"],[9,\"cellspacing\",\"0\"],[7],[0,\"\\n        \"],[6,\"thead\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[2,\" <th>Form</th> \"],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Complete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tfoot\"],[7],[0,\"\\n            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[2,\" <th>Form</th> \"],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"Complete\"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                \"],[6,\"td\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n                \"],[2,\" <td>{{onePost.form}}</td> \"],[0,\"\\n\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[25,\"complete-test\",null,[[\"ID\"],[[19,1,[\"id\"]]]]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/assessment-tests.hbs" } });
});