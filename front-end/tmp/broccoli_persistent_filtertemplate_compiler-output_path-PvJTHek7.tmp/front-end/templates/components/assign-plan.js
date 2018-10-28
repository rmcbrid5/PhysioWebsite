export default Ember.HTMLBars.template({"id":"70z++Ay4","block":"{\"symbols\":[\"treatment\",\"rehabilitationPlan\",\"treatment\"],\"statements\":[[6,\"div\"],[9,\"class\",\"ui green right floated animated button\"],[9,\"style\",\"min-width: 0px;\"],[3,\"action\",[[19,0,[]],\"openModal\"]],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n        Assign Plan\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n        \"],[6,\"i\"],[9,\"class\",\"id card outline icon\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"ui-modal\",null,[[\"name\",\"class\"],[[20,[\"modalName\"]],[20,[\"modalName\"]]]],{\"statements\":[[6,\"div\"],[9,\"class\",\"header\"],[7],[0,\"\\n  Assign Plan to Patient\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"scrolling content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"ui form\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Currently Assigned Rehabilitation Plans\"],[8],[0,\"\\n            \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"existingTreatments\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n                        \"],[1,[19,3,[\"rehabilitationPlan\",\"name\"]],false],[0,\"\\n                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[3,\"action\",[[19,0,[]],\"removeExistingTreatment\",[19,3,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                Remove Treatment\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"field\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Rehabilitation Plans to be Assigned\"],[8],[0,\"\\n            \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"treatmentModel\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"li\"],[7],[0,\"\\n\"],[4,\"ui-dropdown\",null,[[\"class\",\"onChange\"],[\"selection\",[25,\"action\",[[19,0,[]],\"selectRehabilitationPlan\",[19,1,[]]],null]]],{\"statements\":[[0,\"                            \"],[6,\"div\"],[9,\"class\",\"default text\"],[7],[0,\"Select a Rehabilitation Plan\"],[8],[0,\"\\n                            \"],[6,\"i\"],[9,\"class\",\"dropdown icon\"],[7],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"menu\"],[7],[0,\"\\n                                \"],[6,\"div\"],[9,\"data-value\",\"\"],[9,\"class\",\"item\"],[7],[0,\"All Items\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"rehabilitationPlanModel\"]]],null,{\"statements\":[[0,\"                                    \"],[6,\"div\"],[10,\"data-value\",[26,[[19,2,[\"id\"]]]]],[9,\"class\",\"item\"],[7],[0,\"\\n                                        \"],[1,[19,2,[\"name\"]],false],[0,\"\\n                                    \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                            \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                        \"],[6,\"div\"],[9,\"class\",\"ui red right floated animated button\"],[9,\"style\",\"min-width: 0px; margin-right: 4em;\"],[3,\"action\",[[19,0,[]],\"removeTreatment\",[19,1,[]]]],[7],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"\\n                                \"],[6,\"i\"],[9,\"class\",\"delete icon\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"Remove Rehabilitation Plan\"],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"ui blue animated button\"],[3,\"action\",[[19,0,[]],\"addTreatment\"]],[7],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"visible content\"],[7],[0,\"Add Treatment\"],[8],[0,\"\\n                    \"],[6,\"div\"],[9,\"class\",\"hidden content\"],[7],[0,\"\\n                        \"],[6,\"i\"],[9,\"class\",\"plus icon\"],[7],[8],[0,\"\\n                    \"],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"actions\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui red deny button\"],[7],[0,\"\\n    No\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"ui positive right labeled icon button\"],[7],[0,\"\\n    Yes\\n    \"],[6,\"i\"],[9,\"class\",\"checkmark icon\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}","meta":{"moduleName":"front-end/templates/components/assign-plan.hbs"}});