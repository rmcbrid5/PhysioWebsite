define('ember-pikaday/components/pikaday-inputless', ['exports', 'ember', 'ember-pikaday/mixins/pikaday', 'ember-pikaday/templates/pikaday-inputless'], function (exports, _ember, _emberPikadayMixinsPikaday, _emberPikadayTemplatesPikadayInputless) {
  exports['default'] = _ember['default'].Component.extend(_emberPikadayMixinsPikaday['default'], {
    layout: _emberPikadayTemplatesPikadayInputless['default'],

    didInsertElement: function didInsertElement() {
      this.set('field', this.$('.ember-pikaday-input')[0]);
      this.set('pikadayContainer', this.$('.ember-pikaday-container')[0]);
      this.setupPikaday();
    },

    onPikadayOpen: function onPikadayOpen() {},
    onPikadayClose: function onPikadayClose() {}
  });
});