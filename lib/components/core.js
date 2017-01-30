'use strict';

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