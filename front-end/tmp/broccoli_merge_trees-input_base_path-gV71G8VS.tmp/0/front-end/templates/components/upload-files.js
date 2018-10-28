define("front-end/templates/components/upload-files", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "buOryoFr", "block": "{\"symbols\":[\"file\"],\"statements\":[[4,\"each\",[[20,[\"queue\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"ui divided demo items\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"image\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isUploading\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui loader\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"base64Image\"]]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"middle aligned content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"meta\"],[7],[0,\"\\n          \"],[6,\"span\"],[7],[0,\"Size: \"],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"description\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"            \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"p\"],[7],[0,\"Unsupported image\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"extra\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"            \"],[6,\"button\"],[9,\"class\",\"ui icon green basic button\"],[3,\"action\",[[19,0,[]],\"saveFile\",[19,1,[]]]],[7],[0,\"\\n              \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"          \"],[6,\"button\"],[9,\"class\",\"ui icon red basic button\"],[3,\"action\",[[19,0,[]],\"deleteFile\",[19,1,[]]]],[7],[0,\"\\n            \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"ui fluid labeled input\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"ui fluid huge label\"],[10,\"style\",[18,\"labelStyle\"],null],[7],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"big cloud upload icon\"],[7],[8],[0,\"\\n      Click or Drop files into this area to upload files\\n    \"],[8],[0,\"\\n    \"],[6,\"input\"],[9,\"type\",\"file\"],[9,\"value\",\"target.value\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectFile\"],null],null],[10,\"style\",[18,\"inputStyle\"],null],[10,\"accept\",[26,[[18,\"accept\"]]]],[10,\"multiple\",[18,\"multiple\"],null],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"br\"],[7],[8],[0,\"\\n  \"],[6,\"button\"],[9,\"class\",\"ui black button\"],[3,\"action\",[[19,0,[]],\"done\",[20,[\"file\"]]]],[7],[0,\"\\n    Cancel\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"queue\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"savingInProgress\"]]],null,{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"ui labeled green icon loading button\"],[7],[0,\"Loading\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"ui labeled green icon button\"],[3,\"action\",[[19,0,[]],\"saveAllFiles\"]],[7],[0,\"\\n      \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n      Save All\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[6,\"button\"],[9,\"class\",\"ui labeled red icon button\"],[3,\"action\",[[19,0,[]],\"deleteAllFiles\"]],[7],[0,\"\\n    \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n    Remove All\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "front-end/templates/components/upload-files.hbs" } });
});