(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _internalModule = _interopRequireDefault(require("./modules/internalModule"));
var _homeChooseSlider = _interopRequireDefault(require("./modules/homeChooseSlider"));
var _homeTrustedSlider = _interopRequireDefault(require("./modules/homeTrustedSlider"));
var _deleteUnbounceReset = _interopRequireDefault(require("./modules/deleteUnbounceReset"));
var _insertMetaTags = _interopRequireDefault(require("./modules/insertMetaTags"));
var _unbounceCookie = _interopRequireDefault(require("./modules/unbounceCookie"));
var _utmHandler = _interopRequireDefault(require("./modules/utmHandler"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// import Prism from 'prismjs';
(function () {
  // internalModule();
  // Prism.highlightAll(); // Corrected: Use Prism.highlightAll() instead of undefined prismjs()
  (0, _homeChooseSlider["default"])();
  (0, _homeTrustedSlider["default"])();
  (0, _deleteUnbounceReset["default"])();
  (0, _insertMetaTags["default"])();
  // unbounceCookie();
  (0, _utmHandler["default"])();
})();

},{"./modules/deleteUnbounceReset":2,"./modules/homeChooseSlider":3,"./modules/homeTrustedSlider":4,"./modules/insertMetaTags":5,"./modules/internalModule":6,"./modules/unbounceCookie":7,"./modules/utmHandler":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var deleteUnbounceReset = function deleteUnbounceReset() {
  var stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach(function (link) {
    if (link instanceof HTMLLinkElement && link.href.includes('published-css/main-ebbfc5e.z.css')) {
      var _link$parentNode;
      (_link$parentNode = link.parentNode) === null || _link$parentNode === void 0 || _link$parentNode.removeChild(link);
    }
  });
};
var _default = exports["default"] = deleteUnbounceReset;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var homeChooseSlider = function homeChooseSlider() {
  document.addEventListener("DOMContentLoaded", function () {
    var homeChooseSlider = document.querySelector('.home-choose-slider');
    if (homeChooseSlider) {
      var homeChooseSliderInstance = new Swiper('.home-choose-slider', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        // Enable infinite loop
        allowThresholdMove: true,
        slidesPerView: 1,
        // Default to 1 slide per view
        spaceBetween: 7,
        autoplay: {
          delay: 3000,
          // Change slide every 3 seconds
          disableOnInteraction: false // Continue autoplay after interaction
        },
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          // when window width is >= 640px

          480: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          800: {
            slidesPerView: 3,
            spaceBetween: 10
          }
        }
      });
    }
  });
};
var _default = exports["default"] = homeChooseSlider;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var homeTrustedSlider = function homeTrustedSlider() {
  document.addEventListener("DOMContentLoaded", function () {
    var homeTrustedSlider = document.querySelector('.home-trusted-slider');
    if (homeTrustedSlider) {
      var homeTrustedSliderInstance = new Swiper('.home-trusted-slider', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        // Enable infinite loop
        allowThresholdMove: true,
        autoHeight: true,
        watchOverflow: true,
        autoplay: {
          delay: 3000,
          // Change slide every 3 seconds
          disableOnInteraction: false // Continue autoplay after interaction
        },
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      });
    }
  });
};
var _default = exports["default"] = homeTrustedSlider;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var insertMetaTags = function insertMetaTags() {
  var metaTags = [{
    tag: 'meta',
    attrs: {
      charset: 'utf-8'
    }
  }, {
    tag: 'meta',
    attrs: {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1'
    }
  }, {
    tag: 'meta',
    attrs: {
      name: 'format-detection',
      content: 'telephone=no'
    }
  }, {
    tag: 'meta',
    attrs: {
      name: 'theme-color',
      content: '#0096D9'
    }
  }, {
    tag: 'link',
    attrs: {
      rel: 'shortcut icon',
      type: 'image/png',
      href: './assets/img/icon_1024.png'
    }
  }, {
    tag: 'link',
    attrs: {
      rel: 'apple-touch-icon',
      href: './assets/img/icon_1024.png'
    }
  }, {
    tag: 'meta',
    attrs: {
      name: 'description',
      content: 'Breve descripción del sitio web que ayuda en el SEO.'
    }
  }, {
    tag: 'meta',
    attrs: {
      'http-equiv': 'Content-Security-Policy',
      content: 'upgrade-insecure-requests'
    }
  }, {
    tag: 'meta',
    attrs: {
      'http-equiv': 'Cache-Control',
      content: 'no-cache, no-store, must-revalidate'
    }
  }, {
    tag: 'meta',
    attrs: {
      'http-equiv': 'Expires',
      content: '0'
    }
  }, {
    tag: 'meta',
    attrs: {
      'http-equiv': 'Pragma',
      content: 'no-cache'
    }
  }];
  metaTags.forEach(function (_ref) {
    var tag = _ref.tag,
      attrs = _ref.attrs;
    var element = document.createElement(tag);
    Object.entries(attrs).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  });
};
var _default = exports["default"] = insertMetaTags;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var internalModule = function internalModule() {
  console.log('Hola internal Module');
};
var _default = exports["default"] = internalModule;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var unbounceCookie = function unbounceCookie() {
  document.addEventListener("DOMContentLoaded", function () {
    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get('token');
    if (token) {
      // Get all anchor tags in the document
      var anchors = document.getElementsByTagName('a');

      // Convert HTMLCollection to Array and iterate
      Array.from(anchors).forEach(function (anchor) {
        if (anchor.getAttribute("href")) {
          var originalUrl = anchor.getAttribute("href");
          var newUrl = originalUrl.includes('?') ? "".concat(originalUrl, "&token=").concat(token) : "".concat(originalUrl, "?token=").concat(token);
          anchor.setAttribute("href", newUrl);
        }
      });
    } else {
      console.log('No token found in URL');
    }
  });
};
var _default = exports["default"] = unbounceCookie;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// Helper functions for cookies
function getCookie(name) {
  var value = "; ".concat(document.cookie);
  var parts = value.split("; ".concat(name, "="));
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
function setCookie(name, value) {
  document.cookie = "".concat(name, "=").concat(value, "; path=/");
}
var utmHandler = function utmHandler() {
  document.addEventListener("DOMContentLoaded", function () {
    // Get token from URL
    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get('token');
    if (!token) return; // Si no hay token, no hacemos nada

    // Get all anchor tags in the document
    var anchors = document.getElementsByTagName('a');
    Array.from(anchors).forEach(function (anchor) {
      if (anchor.getAttribute("href")) {
        try {
          var originalUrl = anchor.getAttribute("href");
          var urlObj = new URL(originalUrl, window.location.origin);
          // Solo agregamos el token si no está ya presente
          if (!urlObj.searchParams.has('token')) {
            urlObj.searchParams.append('token', token);
            anchor.setAttribute("href", urlObj.toString());
          }
        } catch (e) {
          // Si el href no es una URL válida, lo ignoramos
        }
      }
    });
  });
};
var _default = exports["default"] = utmHandler;

},{}]},{},[1]);

//# sourceMappingURL=index.js.map
