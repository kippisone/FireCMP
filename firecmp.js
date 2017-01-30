(function (root, factory) {
    /*global define:false */

    if (typeof define === 'function' && define.amd) {
        define('FireCMP', [], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.FireCMP = factory();
    }
}(this, function () {
    // 'use strict';

    var deps = [],
        args = Array.prototype.slice.call(arguments);

    var lastCache;
    var require = function(file) {

        if (deps.indexOf(file) !== -1) {
            return args[deps.indexOf(file)];
        }

        if (require.alias && require.alias[file]) {
            file = require.alias[file];
        }

        file = require.resolve(file, this ? this.file : null);

        var module = {
            exports: {},
            file: file
        };

        lastCache = require.cache;
        if (require.cache[file]) {

            if (require.cache[file].obj) {
                return require.cache[file].obj;
            }

            require.cache[file].fn(module, module.exports, require.bind(module));
            require.cache[file].obj = module.exports || {};
            return require.cache[file].obj;
        }
        else {
            throw new Error('Module ' + file + ' not found!');
        }
    };

    require.resolve = function(path, parent) {
        parent = parent || '';

        var resolved = [];
        if (path.charAt(0) === '.') {
            var newPath = parent;
            newPath = newPath.split('/');
            newPath.pop();
            newPath = newPath.concat(path.split('/'));

            newPath.forEach(function(p) {
                if (p === '..') {
                    resolved.pop();
                    return;
                }
                else if (p === '.' || p === '') {
                    return;
                }

                resolved.push(p);
            });

            if (!parent ||parent.charAt(0) === '.') {
                resolved.unshift('.');
            }
        }
        else {
            return path;
        }

        resolved = resolved.join('/');
        if (!/\.js(on)?$/.test(resolved)) {
            resolved += '.js';
        }

        return resolved;
    };

    require.register = function(alias, path, fn) {
        if (arguments.length === 2) {
            fn = path;
            path = alias;
            alias= null;
        }

        require.cache[path] = {fn: fn, calls: 0};
        if (alias) {
            require.alias[alias] = path;
        }
    };

    require.cache = {};
    require.alias = {};

require.register('./index.js', function(module, exports, require) { 'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Password = exports.List = exports.Input = exports.Core = undefined;

var _core = require('./components/core');

var _core2 = _interopRequireDefault(_core);

var _input = require('./components/input');

var _input2 = _interopRequireDefault(_input);

var _inputPassword = require('./components/input-password');

var _inputPassword2 = _interopRequireDefault(_inputPassword);

var _list = require('./components/list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Core = _core2.default;
exports.Input = _input2.default;
exports.List = _list2.default;
exports.Password = _inputPassword2.default;
});
require.register('./components/core.js', function(module, exports, require) { 'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Core = function () {
  function Core(data, name) {
    _classCallCheck(this, Core);

    this.__active = true;
    this.name = name;

    this.create(data);
  }

  /**
   * Sets the component tag. Defaults to 'section'
   *
   * @method tag
   *
   * @return {string} Returns the Component tag
   */


  _createClass(Core, [{
    key: 'create',


    /**
     * Creates the element
     * @method create
     * @chainable
     * @return {object} Returns this value
     */
    value: function create(data) {
      var _this = this;

      var tagName = this.constructor.name;
      if (_typeof(this.tag) === 'object') {
        this.domEl = document.createElement(this.tag.tag);
        if (this.tag.attrs) {
          Object.keys(this.tag.attrs).forEach(function (key) {
            _this.domEl.setAttribute(key, _this.tag.attrs[key]);
          });
        }
      } else {
        this.domEl = document.createElement(this.tag);
      }

      var cssClass = 'firecmp-' + _utils2.default.snakeCase(tagName);
      if (this.cssClass) {
        cssClass += ' ' + this.cssClass;
      }

      if (this.attrs) {
        for (var attr in this.attrs) {
          if (this.attrs.hasOwnProperty(attr)) {
            this.domEl.setAttribute(attr, this.attrs[attr]);
          }
        }
      }

      this.domEl.className = cssClass;
      this.render(data);
      if (this.onElementReady) {
        this.onElementReady();
      }

      return this;
    }

    /**
     * Renders the elements content
     * @method render
     *
     * @param {object} data Render data
     *
     * @chainable
     * @return {object} Returns this value
     */

  }, {
    key: 'render',
    value: function render(data) {
      var html = '';
      if (this.tmpl) {
        html = this.tmpl(data);
      }

      if ((typeof html === 'undefined' ? 'undefined' : _typeof(html)) === 'object') {
        while (this.domEl.firstChild) {
          this.domEl.removeChild(this.domEl.firstChild);
        }

        this.domEl.appendChild(html);
      } else {
        this.domEl.innerHTML = html;
      }

      return this;
    }

    /**
     * Creates the inner html for a component. This method can be overridden to add its own inner html
     *
     * @method tmpl
     * @returns {string} Returns the parsed inner html of a component
     */

  }, {
    key: 'tmpl',
    value: function tmpl(data) {
      return String(data);
    }

    /**
     * Append CMP to an existing DOM element
     *
     * @method appendTo
     * @chainable
     */

  }, {
    key: 'appendTo',
    value: function appendTo(container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }

      container.appendChild(this.domEl);
      return this;
    }

    /**
     * Sets a tag style. To unset it, leave value empty
     *
     * @method setStyle
     * @chainable
     */

  }, {
    key: 'setStyle',
    value: function setStyle(style, value) {
      this.domEl.style[style] = value;
      return this;
    }

    /**
     * Checks if CMP has a given class
     *
     * @method hasClass
     * @returns {boolean} Returns true if CMP has a given class
     */

  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      var classList = this.domEl.className;
      if (!classList) {
        this.domEl.className = className;
        return false;
      }

      var reg = new RegExp('\\b' + className + '\\b');
      return reg.test(classList);
    }

    /**
     * Sets a class if CMP hasn't it already
     *
     * @method addClass
     * @chainable
     */

  }, {
    key: 'addClass',
    value: function addClass(className) {
      var classList = this.domEl.className;
      if (!classList) {
        this.domEl.className = className;
        return this;
      }

      var reg = new RegExp('\\b' + className + '\\b');
      if (!reg.test(classList)) {
        this.domEl.className += ' ' + className;
      }

      return this;
    }

    /**
     * Removes a given class if CMP has it
     *
     * @method removeClass
     * @chainable
     */

  }, {
    key: 'removeClass',
    value: function removeClass(className) {
      var classList = this.domEl.className;
      var reg = new RegExp(' ?\\b' + className + '\\b ?');
      this.domEl.className = classList.replace(reg, '');
      return this;
    }

    /**
     * Add a CMP attribute
     *
     * @method addAttribute
     * @chainable
     */

  }, {
    key: 'addAttribute',
    value: function addAttribute(key, value) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        Object.keys(key).forEach(function (name) {
          this.domEl.setAttribute(name, key[name]);
        });

        return this;
      }

      this.domEl.setAttribute(key, value);
      return this;
    }

    /**
     * Append one or multiple elements to the Component
     *
     * @method append
     * @param  {Object|Array|String} el Elements to been append
     *
     * @chainable
     * @return {Object}    Returns this value
     */

  }, {
    key: 'append',
    value: function append(el) {
      var i;

      if (Array.isArray(el)) {
        for (i = 0; i < el.length; i++) {
          this.domEl.appendChild(el[i].domEl);
        }

        return;
      } else if (typeof el === 'string') {
        var docFrac = document.createDocumentFragment();
        var elType = /^<tr/.test(el) ? 'table' : 'div';
        var div = document.createElement(elType);
        div.innerHTML = el;
        for (i = 0; i < div.children.length; i++) {
          docFrac.appendChild(div.children[i]);
        }

        this.domEl.appendChild(docFrac);
      } else {
        this.domEl.appendChild(el.domEl);
      }

      return this;
    }
  }, {
    key: 'tag',
    get: function get() {
      return 'section';
    }
  }, {
    key: 'active',
    get: function get() {
      return this.__active;
    },
    set: function set(value) {
      this.__active = value;
      this.setStyle('display', value ? '' : 'none');
    }
  }]);

  return Core;
}();

exports.default = Core;
});
require.register('./utils.js', function(module, exports, require) { 'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * FireCMP Utils
 */

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'snakeCase',
    value: function snakeCase(str) {
      return str.replace(/[A-Z]/g, function (match, offset) {
        return (offset ? '-' : '') + match.toLowerCase();
      });
    }
  }]);

  return Utils;
}();

exports.default = Utils;
});
require.register('./components/input.js', function(module, exports, require) { 'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Input = function (_Core) {
  _inherits(Input, _Core);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).apply(this, arguments));
  }

  _createClass(Input, [{
    key: 'tmpl',
    value: function tmpl(data) {
      var id = 'firecmp-input-' + this.name;
      this.labelEl = document.createElement('label');
      this.labelEl.setAttribute('id', id);

      this.inputEl = document.createElement('input');
      this.inputEl.setAttribute('type', this.type);
      this.inputEl.setAttribute('name', this.name);
      this.inputEl.setAttribute('for', id);
      this.inputEl.value = data;

      var docFrag = document.createDocumentFragment();
      docFrag.appendChild(this.labelEl);
      docFrag.appendChild(this.inputEl);
      return docFrag;
    }

    /**
     * Listen on value changes
     *
     * @method $change
     *
     * @param {function} fn Event handler
     */

  }, {
    key: '$change',
    value: function $change(fn) {
      this.inputEl.addEventListener('change', function (ev) {
        fn({
          name: ev.currentTarget.name,
          value: ev.currentTarget.value
        }, ev);
      });
    }
  }, {
    key: 'label',
    set: function set(value) {
      this.labelEl.textContent = value;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'text';
    }
  }]);

  return Input;
}(_core2.default);

exports.default = Input;
});
require.register('./components/input-password.js', function(module, exports, require) { 'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Password = function (_Input) {
  _inherits(Password, _Input);

  function Password() {
    _classCallCheck(this, Password);

    return _possibleConstructorReturn(this, (Password.__proto__ || Object.getPrototypeOf(Password)).apply(this, arguments));
  }

  _createClass(Password, [{
    key: 'type',
    get: function get() {
      return 'password';
    }
  }]);

  return Password;
}(_input2.default);

exports.default = Password;
});
require.register('./components/list.js', function(module, exports, require) { 'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = function (_Core) {
  _inherits(List, _Core);

  function List() {
    _classCallCheck(this, List);

    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
  }

  _createClass(List, [{
    key: 'item',


    /**
     * Sets an item template
     */
    value: function item(data) {
      return '<li class="item">' + data + '</li>';
    }
  }, {
    key: 'render',
    value: function render(data) {
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          this.push(item);
        }, this);
      }
    }
  }, {
    key: 'push',
    value: function push(data) {
      this.append(this.item(data));
    }
  }, {
    key: 'tag',
    get: function get() {
      return 'ul';
    }
  }]);

  return List;
}(_core2.default);

exports.default = List;
});
return require('./index.js');

}));