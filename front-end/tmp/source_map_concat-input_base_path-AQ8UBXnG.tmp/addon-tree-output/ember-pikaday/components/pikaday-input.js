define('ember-pikaday/components/pikaday-input', ['exports', 'ember', 'ember-pikaday/mixins/pikaday'], function (exports, _ember, _emberPikadayMixinsPikaday) {
  exports['default'] = _ember['default'].Component.extend(_emberPikadayMixinsPikaday['default'], {
    tagName: 'input',

    attributeBindings: ['readonly', 'tabindex', 'disabled', 'placeholder', 'type', 'name', 'size', 'required', 'title', 'hidden', 'autocomplete'],

    type: 'text',

    didInsertElement: function didInsertElement() {
      this.set('field', this.element);
      this.setupPikaday();
    },

    onPikadayOpen: function onPikadayOpen() {
      this.get('onOpen')();
    },

    onPikadayClose: function onPikadayClose() {
      if (this.get('pikaday').getDate() === null || _ember['default'].isEmpty(this.$().val())) {
        this.set('value', null);
        this.get('onSelection')(null);
      }

      this.get('onClose')();
    }
  });
});