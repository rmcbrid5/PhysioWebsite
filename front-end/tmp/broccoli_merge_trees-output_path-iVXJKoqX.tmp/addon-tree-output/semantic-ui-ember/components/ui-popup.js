define('semantic-ui-ember/components/ui-popup', ['exports', 'semantic-ui-ember/mixins/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend(_base.default, {
    module: 'popup',

    didInitSemantic: function didInitSemantic() {
      this._super.apply(this, arguments);
      var possibleAttrs = ['content', 'title', 'html'];
      for (var i = 0; i < possibleAttrs.length; i++) {
        var possibleAttr = possibleAttrs[i];
        if (this._hasOwnProperty(this.attrs, possibleAttr) || this.get(possibleAttr) != null) {
          this.get('_settableAttrs').addObject(possibleAttr);
        }
      }
      this.get('_settableAttrs').removeObject('position');
    },
    setSemanticAttr: function setSemanticAttr(attrName, attrValue) {
      if (attrName === 'content' || attrName === 'title' || attrName === 'html') {
        var value = this._unwrapHTMLSafe(attrValue);
        var response = this.execute('setting', attrName, value);
        if (this.execute('is visible')) {
          var html = void 0;
          if (attrName === 'html') {
            html = value;
          } else {
            var text = void 0;
            if (attrName === 'content') {
              text = {
                title: this.get('title'),
                content: value
              };
            } else {
              text = {
                title: value,
                content: this.get('content')
              };
            }
            var moduleGlobal = this.getSemanticModuleGlobal();
            html = moduleGlobal.settings.templates.popup(text);
          }
          this.execute('change content', html);
        }
        return response;
      }
      return this._super.apply(this, arguments);
    }
  });
});