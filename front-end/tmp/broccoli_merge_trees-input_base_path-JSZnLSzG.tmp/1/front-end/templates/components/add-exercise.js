export default Ember.HTMLBars.template({"id":"NC7Eh0Jk","block":"{\"symbols\":[\"file\",\"actionStep\",\"objective\"],\"statements\":[[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Exercise\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[\"newExercise\",\"newExercise\"]],{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n        Adding New Exercise\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Name\"],[8],[0,\"\\n                \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\",\"placeholder\"],[\"text\",\"50\",\"1\",[20,[\"name\"]],\"Add name\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Description\"],[8],[0,\"\\n                \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"description\"]],\"50\",\"3\",\"Add description\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Objectives\"],[8],[0,\"\\n                \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"objectiveModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n                        \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,3,[\"value\"]]]]],false],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeObjective\",[19,3,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Objective\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addObjective\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Objective\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Action Steps\"],[8],[0,\"\\n                \"],[6,\"ol\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"actionStepModel\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"li\"],[7],[0,\"\\n                            \"],[1,[25,\"input\",null,[[\"type\",\"cols\",\"rows\",\"value\"],[\"text\",\"50\",\"1\",[19,2,[\"value\"]]]]],false],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeActionStep\",[19,2,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Action Step\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                \"],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addActionStep\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add New Action Step\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Frequency\"],[8],[0,\"\\n                  \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"frequency\"]],\"50\",\"1\",\"Add frequency\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Duration\"],[8],[0,\"\\n                  \"],[1,[25,\"textarea\",null,[[\"value\",\"cols\",\"rows\",\"placeholder\"],[[20,[\"duration\"]],\"50\",\"1\",\"Add duration\"]]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Image\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"queue\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"ui divided demo items\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"item\"],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"image\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isUploading\"]]],null,{\"statements\":[[0,\"                        \"],[6,\"div\"],[9,\"class\",\"ui active inverted dimmer\"],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"ui loader\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                        \"],[6,\"img\"],[10,\"src\",[26,[[19,1,[\"base64Image\"]]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                    \"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"middle aligned content\"],[7],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"header\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"meta\"],[7],[0,\"\\n                        \"],[6,\"span\"],[7],[0,\"Size: \"],[1,[19,1,[\"size\"]],false],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"description\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isDisplayableImage\"]]],null,{\"statements\":[[0,\"                            \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                            \"],[6,\"p\"],[7],[0,\"Unsupported image\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                        \"],[8],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"extra\"],[7],[0,\"\\n                        \"],[6,\"button\"],[9,\"class\",\"ui icon red basic button\"],[3,\"action\",[[19,0,[]],\"deleteFile\",[19,1,[]]]],[7],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"remove icon\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"ui fluid labeled input\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"class\",\"ui fluid huge label\"],[10,\"style\",[18,\"labelStyle\"],null],[7],[0,\"\\n                    \"],[6,\"i\"],[9,\"class\",\"big cloud upload icon\"],[7],[8],[0,\"\\n                    Click or Drop files into this area to upload files\\n                    \"],[8],[0,\"\\n                    \"],[6,\"input\"],[9,\"type\",\"file\"],[9,\"value\",\"target.value\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"selectFile\"],null],null],[10,\"style\",[18,\"inputStyle\"],null],[10,\"accept\",[26,[[18,\"accept\"]]]],[10,\"multiple\",[18,\"multiple\"],null],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"br\"],[7],[8],[0,\"\\n                \"],[6,\"button\"],[9,\"class\",\"ui black button\"],[3,\"action\",[[19,0,[]],\"done\",[20,[\"file\"]]]],[7],[0,\"\\n                    Cancel\\n                \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui black deny button\"],[7],[0,\"\\n        Cancel\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n        Save\\n        \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}","meta":{"moduleName":"front-end/templates/components/add-exercise.hbs"}});