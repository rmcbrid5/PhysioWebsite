define('semantic-ui-ember/mixins/base', ['exports', 'semantic-ui-ember/semantic'], function (exports, _semantic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var EMBER_ATTRS = ['class', 'classNameBindings', 'classNames', 'tagName'];
  var HTML_ATTRS = ['id', 'name', 'readonly', 'autofocus', 'tabindex', 'title'];
  var CUSTOM_ATTRS = ['onElement'];

  _semantic.default.BaseMixin = Ember.Mixin.create({
    /// Internal Variables
    _initialized: false,
    _bindableAttrs: null,
    _settableAttrs: null,
    _ignorableAttrs: null,

    attributeBindings: ['autofocus', 'tabindex', 'title'],

    init: function init() {
      this._super.apply(this, arguments);

      if (Ember.isBlank(this.getSemanticModuleName())) {
        return Ember.Logger.error('A module was not declared on semantic extended type');
      }
      this.set('_initialized', false);
      this.set('_bindableAttrs', Ember.A());
      this.set('_settableAttrs', Ember.A());
      this.set('_ignorableAttrs', this.getSemanticIgnorableAttrs());
    },
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.initSemanticModule();

      // Get the modules settable and gettable properties.
      var settableProperties = Ember.A(Object.keys(this.execute('internal', 'set')));
      var gettableProperties = Ember.A(Object.keys(this.execute('internal', 'get')));

      for (var key in this.get('attrs')) {
        // If it has a settable and gettable attribute, then its bindable
        if (settableProperties.includes(key) && gettableProperties.includes(key)) {
          this.get('_bindableAttrs').addObject(key);
        } else if (settableProperties.includes(key)) {
          // otherwise, its settable only
          this.get('_settableAttrs').addObject(key);
        }
      }
      this.didInitSemantic();
      this.set('_initialized', true);
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this.execute('destroy');
    },
    didUpdateAttrs: function didUpdateAttrs() {
      this._super.apply(this, arguments);
      for (var i = 0; i < this.get('_bindableAttrs').length; i++) {
        var bindableAttr = this.get('_bindableAttrs')[i];
        var attrValue = this._getAttrValue(bindableAttr);
        var moduleValue = this.getSemanticAttr(bindableAttr);
        if (!this.areAttrValuesEqual(bindableAttr, attrValue, moduleValue)) {
          this.setSemanticAttr(bindableAttr, attrValue);
        }
      }
      for (var _i = 0; _i < this.get('_settableAttrs').length; _i++) {
        var settableAttr = this.get('_settableAttrs')[_i];
        var _attrValue = this._getAttrValue(settableAttr);
        this.setSemanticAttr(settableAttr, _attrValue);
      }
    },
    getSemanticIgnorableAttrs: function getSemanticIgnorableAttrs() {
      var ignorableAttrs = [];
      if (Ember.isPresent(this.get('ignorableAttrs'))) {
        ignorableAttrs = ignorableAttrs.concat(this.get('ignorableAttrs'));
      }
      ignorableAttrs = ignorableAttrs.concat(EMBER_ATTRS);
      ignorableAttrs = ignorableAttrs.concat(HTML_ATTRS);
      ignorableAttrs = ignorableAttrs.concat(CUSTOM_ATTRS);
      return Ember.A(ignorableAttrs);
    },
    getSemanticScope: function getSemanticScope() {
      if (Ember.isPresent(this.get('onElement'))) {
        return this.$(this.get('onElement'));
      }
      return this.$();
    },
    getSemanticModuleName: function getSemanticModuleName() {
      return this.get('module');
    },
    getSemanticModule: function getSemanticModule() {
      if (this._isFastBoot()) {
        return;
      }
      var selector = this.getSemanticScope();
      if (selector != null) {
        var module = selector[this.getSemanticModuleName()];
        if (typeof module === 'function') {
          return module;
        }
      }
      return null;
    },
    getSemanticModuleGlobal: function getSemanticModuleGlobal() {
      if (this._isFastBoot()) {
        return;
      }
      var moduleName = this.getSemanticModuleName();
      return Ember.$.fn[moduleName];
    },
    willInitSemantic: function willInitSemantic(settings) {// eslint-disable-line no-unused-vars
      // Use this method to modify the settings object on inherited components, before module initialization
    },
    initSemanticModule: function initSemanticModule() {
      if (this._isFastBoot()) {
        return;
      }
      var module = this.getSemanticModule();
      if (module) {
        module.call(this.getSemanticScope(), this._settings());
      } else {
        Ember.Logger.error('The Semantic UI module ' + this.getSemanticModuleName() + ' was not found and did not initialize');
      }
    },
    didInitSemantic: function didInitSemantic() {
      // Use this method after the module is initialized to do post initialized changes
    },
    getSemanticAttr: function getSemanticAttr(attrName) {
      return this.execute('get ' + attrName);
    },
    setSemanticAttr: function setSemanticAttr(attrName, attrValue) {
      return this.execute('set ' + attrName, this._unwrapHTMLSafe(attrValue));
    },
    areAttrValuesEqual: function areAttrValuesEqual(attrName, attrValue, moduleValue) {
      return attrValue === moduleValue || this._stringCompareIfPossible(attrValue) === this._stringCompareIfPossible(moduleValue) || Ember.isEqual(attrValue, moduleValue);
    },
    execute: function execute() {
      if (this._isFastBoot()) {
        return;
      }
      var module = this.getSemanticModule();
      if (module) {
        return module.apply(this.getSemanticScope(), arguments);
      }
      Ember.Logger.warn("The execute method was called, but the Semantic-UI module didn't exist.");
    },


    actions: {
      execute: function execute() {
        return this.execute.apply(this, arguments);
      }
    },

    _getAttrValue: function _getAttrValue(name) {
      var value = this.get('attrs.' + name);

      if (Ember.isBlank(value)) {
        return value;
      }

      // if its a mutable object, get the actual value
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        var objectKeys = Ember.A(Object.keys(value));
        if (objectKeys.any(function (objectkey) {
          return objectkey.indexOf('MUTABLE_CELL') >= 0;
        })) {
          value = Ember.get(value, 'value');
        }
      }

      return value;
    },
    _settings: function _settings() {
      var moduleName = this.getSemanticModuleName();

      var moduleGlobal = this.getSemanticModuleGlobal();
      if (!moduleGlobal) {
        Ember.Logger.error('Unable to find jQuery Semantic UI module: ' + moduleName);
        return;
      }

      var custom = {
        debug: _semantic.default.UI_DEBUG,
        performance: _semantic.default.UI_PERFORMANCE,
        verbose: _semantic.default.UI_VERBOSE
      };

      for (var key in this.get('attrs')) {
        var value = this._getAttrValue(key);

        if (!this._hasOwnProperty(moduleGlobal.settings, key)) {
          if (!this.get('_ignorableAttrs').includes(key) && !this.get('_ignorableAttrs').includes(Ember.String.camelize(key))) {
            // TODO: Add better ember keys here
            // Ember.Logger.debug(`You passed in the property '${key}', but a setting doesn't exist on the Semantic UI module: ${moduleName}`);
          }
          continue;
        }

        if (value != null) {
          custom[key] = value;
        }
      }

      // Init, and allow any overrides
      this.willInitSemantic(custom);

      // Late bind any functions over to use the right scope
      for (var _key in custom) {
        var _value = custom[_key];
        if (typeof _value === 'function') {
          custom[_key] = Ember.run.bind(this, this._updateFunctionWithParameters(_key, _value));
        }
        if ((typeof _value === 'undefined' ? 'undefined' : _typeof(_value)) === 'object') {
          if (Ember.String.isHTMLSafe(_value)) {
            custom[_key] = this._unwrapHTMLSafe(_value);
          }
        }
      }

      return custom;
    },
    _updateFunctionWithParameters: function _updateFunctionWithParameters(key, fn) {
      return function () {
        var args = [].splice.call(arguments, 0);
        // always add component instance as the last parameter incase they need access to it
        args.push(this);

        if (this.get('_initialized')) {
          return fn.apply(this, args);
        }
      };
    },
    _stringCompareIfPossible: function _stringCompareIfPossible(value) {
      // If its undefined or null, compare on null
      if (value == null) {
        return null;
      }
      // We should only compare string values on primitive types
      switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
        case "string":
          return value;
        case "boolean":
        case "number":
          return value.toString();
        case "object":
          return this._unwrapHTMLSafe(value);
        default:
          // Don't convert to string, otherwise it would be "[Object]"
          return value;
      }
    },
    _setAttrBindable: function _setAttrBindable(attrName) {
      if (this.get('_settableAttrs').includes(attrName)) {
        this.get('_settableAttrs').removeObject(attrName);
        this.get('_bindableAttrs').addObject(attrName);
      }
    },
    _unwrapHTMLSafe: function _unwrapHTMLSafe(value) {
      if (Ember.String.isHTMLSafe(value)) {
        return value.toString();
      }
      return value;
    },
    _hasOwnProperty: function _hasOwnProperty(object, property) {
      if (object) {
        if (object.hasOwnProperty && typeof object.hasOwnProperty === "function") {
          return object.hasOwnProperty(property);
        }
        // Ember 2.9 returns an EmptyObject, which doesn't have hasOwnProperty
        return Object.prototype.hasOwnProperty.call(object, property);
      }

      return false;
    },
    _isFastBoot: function _isFastBoot() {
      var owner = Ember.getOwner(this);
      var fastboot = owner.lookup('service:fastboot');
      return fastboot && fastboot.get('isFastBoot');
    }
  });

  exports.default = _semantic.default.BaseMixin;
});