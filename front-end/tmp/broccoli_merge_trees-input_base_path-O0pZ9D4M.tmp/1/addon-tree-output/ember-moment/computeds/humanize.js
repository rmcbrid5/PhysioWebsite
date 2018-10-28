define('ember-moment/computeds/humanize', ['exports', 'moment', 'ember-moment/computeds/-base'], function (exports, _moment, _emberMomentComputedsBase) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports['default'] = (0, _emberMomentComputedsBase['default'])(function humanizeComputed(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var duration = _ref2[0];
    var suffixless = _ref2[1];

    if (!_moment['default'].isDuration(duration)) {
      duration = _moment['default'].duration(duration);
    }

    return duration.humanize(suffixless);
  });
});