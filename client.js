/*
 * Client and Feature Detection Script
 * Leon Slater
 * http://mynamesleon.com
 * github.com/mynamesleon/detection
 */

window.client = window.client || new function Client() {
    'use strict';

    var _navAgent = window.navigator.userAgent,
        _doc = window.document,
        _div = _doc.createElement('div'),
        _img = new Image(),
        _raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
        _caf = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame,
        _cache = {},

        _checks = {
            // user agent checks
            uas: {
                IE: 'msie|rv:11',
                IE7: 'msie 7.0',
                IE8: 'msie 8.0',
                IE9: 'msie 9.0',
                IE10: 'msie 10.0',
                IE11: 'rv:11.0',
                oldIE: 'msie 7.0|msie 8.0',
                edge: 'edge/12',
                iPad: 'ipad',
                iPhone: 'iphone',
                iPod: 'ipod',
                iOS: 'iphone|ipad|ipod',
                chrome: 'chrome',
                firefox: 'firefox',
                opera: 'opera|opr',
                android: 'android',
                mobile: 'android|webos|iphone|ipad|ipod|blackberry|windows phone|iemobile',
                desktop: '^((?!(android|webos|iphone|ipad|ipod|blackberry|windows phone|iemobile)).)*$',
                windowsPhone: 'windows phone',
                mac: 'mac'
            },
            // css properties
            props: {
                perspective: ['perspective', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'], // translateZ support
                transform: ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'],
                transition: ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'],
                willChange: ['willChange'],
                animation: ['animation', 'WebkitAnimation', 'MozAnimation', 'OAnimation'],
                objectFit: ['objectFit'],
                objectPosition: ['objectPosition']
            },
            // css units
            units: {
                vw: '1vw',
                vh: '1vh',
                rem: '1rem',
                vmin: '1vmin',
                vmax: '1vmax'
            },
            // unique checks - functions are called in the context of the main returned object
            unique: {
                safari: _navAgent.indexOf('chrome') > -1 ? false : _navAgent.indexOf('safari') > -1,
                retina: window.devicePixelRatio >= 1.5,
                pictureElem: typeof window.HTMLPictureElement !== 'undefined',
                srcsetBasic: typeof _img.srcset !== 'undefined', // basic 1x / 2x descriptor use of srcset
                // full srcset use, including media queries - check for basic as well due to false positives in older firefox
                srcsetFull: typeof _img.srcset !== 'undefined' && typeof _img.sizes !== 'undefined',

                /*
                 * calc check
                 * @return {string|boolean}: supported calc string, or false if unsupported
                 */
                calc: function () {
                    var props = ['calc', '-webkit-calc', '-moz-calc', '-o-calc'],
                        i;

                    for (i = 0; i < props.length; i += 1) {
                        if (this.valCheck(props[i] + '(1px)')) {
                            return props[i];
                        }
                    }
                    return false;
                },

                /*
                 * canvas check
                 * @return {boolean}
                 */
                canvas: function () {
                    var canvas = _doc.createElement('canvas');
                    return !!(canvas.getContext && canvas.getContext('2d'));
                }
            }
        },

        /*
         * canvas check
         * @param s {string}
         * @return {string}
         */
        _trim = function (s) {
            return s.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'');
        },

        /*
         * check if result has been cached and return if so, otherwise call and cache
         * @param k {string}: key
         * @param f {function}: modifier function/check to run against a
         * @param c {object}: context to call the modifier function within
         * @param a {misc}: argument to be passed to f
         */
        _check = function (k, f, c, a) {
            return function () {
                if (typeof _cache[k] === 'undefined') {
                    _cache[k] = f.call(c, a);
                }
                return _cache[k];
            };
        },

        /*
         * loop to cycle through object properties
         * @param t {object}: target object to merge property into
         * @param o {object}: object to merge into target
         * @param f {function}: function to use when checking properties
         */
        _merge = function (t, o, f) {
            var i;
            f = f || function (a) {
                return typeof a === 'function' ? a.call(this) : a;
            };
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    t[i] = _check(i, f, t, o[i]);
                }
            }
        },

        /*
         * feature and user agent detection
         * @return {object} feature and user agent data
         */
        _run = function () {
            var result = this;

            /*
             * request animation frame
             * @return {function}: native request animation frame if supported
             *      polyfill adapted from original by Erik Moller if not
             */
            result.requestAnimFrame = (function () {
                if (typeof _raf !== 'undefined' && typeof _caf !== 'undefined') {
                    return function (f) { return _raf(f); };
                }
                var l;
                return function (f) {
                    var c = new Date().getTime(),
                        t = Math.max(0, 16 - (c - l));
                    l = c + t;
                    return window.setTimeout(function () {
                        f(l);
                    }, t);
                };
            }());

            /*
             * cancel animation frame
             * @return {function}: native cancel animation frame if supported
             *      polyfill adapted from original by Erik Moller if not
             */
            result.cancelAnimFrame = (function () {
                if (typeof _raf !== 'undefined' && typeof _caf !== 'undefined') {
                    return function (id) { return _caf(id); };
                }
                return function (id) {
                    window.clearTimeout(id);
                };
            }());

            /*
             * inclusive RegEx check against the browser's User Agent
             * @param val {string}: expression to check
             * @return {boolean}: if expression passes
             */
            result.uaCheck = function (val) {
                var expr = new RegExp(val, ['i']);
                return expr.test(_navAgent);
            };

            /*
             * check for CSS property support
             * @param props {string|array}: array or space-delimitted string of propertie(s) to check
             *      e.g. ['boxSizing', 'WebkitBoxSizing'] or 'boxSizing WebkitBoxSizing'
             * @return {string|boolean}: returns first supported property - returns false if none are supported
             */
            result.propCheck = function (props, elem) {
                var p,
                    prop;

                elem = elem || _div;

                if (typeof props === 'string') {
                    props = props.split(' ');
                }

                for (p = 0; p < props.length; p += 1) {
                    prop = props[p];
                    if (typeof elem.style[prop] !== 'undefined') {
                        return prop;
                    }
                }
                return false;
            };

            /*
             * CSS check with custom defined property and value
             * @param prop {string}: CSS property to use
             * @param val {string}: CSS value to use
             * @return {boolean}: if property and value applied can be used
             * if only one argument passed in, will be taken as value applied to width
             */
            result.valCheck = function (prop, val, elem) {
                if (typeof val === 'undefined') { // if only one param passed in, assume it is the value to be used
                    val = prop;
                    prop = 'width'; // set prop to width as default value
                }

                elem = elem || _div;
                elem.style.cssText = prop + ':' + val + ';';
                return !!elem.style.length;
            };

            /*
             * add a test to the client object
             * @param key {string}: test name (key to use in the client object)
             * @param test {misc}: test to run
             */
            result.addTest = function (key, test) {
                result[key] = result[key] || _check(key, function (a) {
                    return typeof a === 'function' ? a.call(this) : a;
                }, result, test);
            };

            /*
             * add lowercase property name as class to HTML tag if supported
             * @param toCall {boolean}: whether to call any tests that have not yet been run - defaults to true
             */
            result.setClasses = function (toCall) {
                var cur = (' ' + _doc.documentElement.className + ' ').replace(' no-js ', ' js '),
                    source = toCall === false ? _cache : result,
                    a = [],
                    keys,
                    reg,
                    c,
                    i;

                // keys in the client object to ignore
                keys = ' addTest | uaCheck | propCheck | valCheck | requestAnimFrame | cancelAnimFrame | setClasses ';
                reg = new RegExp(keys, ['i']); // use case in-sensitive search

                for (i in result) {
                    // check that the key does not match the excluded keys, that the value is truthy, and the key is not already in the documentElement classname
                    if (result.hasOwnProperty(i) && !reg.test(' ' + (c = i.toLowerCase()) + ' ') && cur.indexOf(' ' + c + ' ') === -1 && !!(typeof source[i] === 'function' ? source[i]() : source[i])) {
                        a.push(c);
                    }
                }

                _doc.documentElement.className = _trim(_trim(cur) + ' ' + a.join(' '));
            };

            _merge(result, _checks.props, result.propCheck); // cycle through css property checks
            _merge(result, _checks.units, result.valCheck); // cycle through unit checks
            _merge(result, _checks.uas, result.uaCheck); // cycle through uaChecks and see if they're contained in the userAgent string
            _merge(result, _checks.unique); // cycle through unique checks
        };

    return new _run();

}();
