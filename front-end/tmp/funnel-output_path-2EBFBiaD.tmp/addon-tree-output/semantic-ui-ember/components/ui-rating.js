define('semantic-ui-ember/components/ui-rating', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    module: 'rating',
    classNames: ['ui', 'rating'],
    ignorableAttrs: ['rating'],

    willInitSemantic: function willInitSemantic(settings) {
      this._super.apply(this, arguments);
      if (settings.initialRating == null && this.get('rating')) {
        settings.initialRating = this.get('rating');
      }
    }
  });
});