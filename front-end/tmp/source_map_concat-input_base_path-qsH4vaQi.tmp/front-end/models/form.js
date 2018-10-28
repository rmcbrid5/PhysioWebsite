define('front-end/models/form', ['exports', 'ember-data'], function (exports, _emberData) {
				'use strict';

				Object.defineProperty(exports, "__esModule", {
								value: true
				});
				exports.default = _emberData.default.Model.extend({
								name: _emberData.default.attr('string'),
								description: _emberData.default.attr('string'),
								administrator: _emberData.default.attr('string'),
								assessmentTests: _emberData.default.attr(),
								questionsLists: _emberData.default.attr(),
								injuryForms: _emberData.default.attr()
				});
});