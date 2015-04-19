/* 
 * Client and Feature Detection Script
 * Leon Slater
 * http://mynamesleon.com
 */

window.client = window.client || new function() {
    'use strict';
    
    var _navAgent = window.navigator.userAgent.toLowerCase(),
        _div = window.document.createElement('div'),
        _img = new Image(),
        
        _checks = {
            uas: {
                IE: 'msie|rv:11',
                IE7: 'msie 7.0',
                IE8: 'msie 8.0',
                IE9: 'msie 9.0',
                IE10: 'msie 10.0',
                IE11: 'rv:11.0',
                oldIE: 'msie 7.0|msie 8.0',
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
            props: {
                perspective: ['perspective', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'], // translateZ support
                transform: ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'],
                transition: ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'],
                willChange: ['willChange'],
                animation: ['animation', 'WebkitAnimation', 'MozAnimation', 'OAnimation'],
                objectFit: ['objectFit'],
                objectPosition: ['objectPosition']
            },
            // css values to check support of
            units: {
                vw: '1vw',
                vh: '1vh',
                rem: '1rem',
                vmin: '1vmin',
                vmax: '1vmax'
            }
        },
        
        /*
         * loop to cycle through object properties
         * @param t {object}: target object to merge property into
         * @param o {object}: object to merge into target
         * @param f {function}: function to use when checking properties
         */
        _merge = function (t, o, f) {
            var i;
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    t[i] = f(o[i]);
                }
            }
        },
        
        /*
         * feature and user agent detection
         * @return {object} feature and user agent data
         */
        _run = function () {
            var result = {},
                raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
                caf = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame;
            
            // unique checks that don't fit into the 'checks' categories
            result.safari = _navAgent.indexOf('chrome') > -1 ? false : _navAgent.indexOf('safari') > -1;
            result.retina = window.devicePixelRatio >= 1.5;
            result.pictureElem = typeof window.HTMLPictureElement !== 'undefined';
            result.srcsetBasic = typeof _img.srcset !== 'undefined'; // basic 1x / 2x descriptor use of srcset
            result.srcsetFull = typeof _img.srcset !== 'undefined' && typeof _img.sizes !== 'undefined'; // full srcset use, including media queries
            
            /*
             * calc check
             * @return {string|boolean}: supported calc string, or false if unsupported
             */
            result.calc = (function (props) {
                for (var i = 0; i < props.length; i += 1) {
                    if (props.hasOwnProperty(i)) {
                        _div.style.cssText = 'width:' + props[i] + '(1px);';
                        if (_div.style.length) {
                            return props[i];
                        }
                    }
                }
                return false;
            }(['calc', '-webkit-calc', '-moz-calc', '-o-calc']));
            
            /*
             * request animation frame
             * @return {function}: native request animation frame if supported
             *      polyfill adapted from original by Erik Moller if not
             */
            result.requestAnimFrame = new function (r, c) {
                if (typeof r !== 'undefined' && typeof r !== 'undefined') {
                    return r;
                }
                var l;
                return function (f) {
                    var c = new Date().getTime(),
                        t = Math.max(0, 16 - (currTime - lastTime));
                    l = currTime + timeToCall;
                    return window.setTimeout(function () { f(l); }, t);
                }
            }(raf, caf);
            
            /*
             * cancel animation frame
             * @return {function}: native cancel animation frame if supported
             *      polyfill adapted from original by Erik Moller if not
             */
            result.cancelAnimFrame = new function (r, c) {
                if (typeof r !== 'undefined' && typeof c !== 'undefined') {
                    return c;
                }
                return function(id) { window.clearTimeout(id); }
            }(raf, caf);
            
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
            result.propCheck = function (props, objProp) {
                var p,
                    prop;

                if (typeof props === 'string') { // if a string is passed in, separate it into an array first
                    props = props.split(' ');
                }

                for (p in props) {
                    if (props.hasOwnProperty(p)) {
                        prop = props[p];
                        if (typeof _div.style[prop] !== 'undefined') {
                            return prop;
                        }
                    }
                }
                return false;
            };

            /*
             * CSS check with custom defined property and value
             * @param val {string}: CSS value to use
             * @param prop {string} optional: CSS property to use - will use 'width' if none is passed in
             * @return {boolean}: if property and value applied can be used
             */
            result.valCheck = function (val, prop) {
                prop = prop || 'width';
                _div.style.cssText = prop + ':' + val;
                if (_div.style.length) {
                    return true;
                }
                return false;
            };

            /*
             * add lowercase property name as class to HTML tag if supported
             * @return {boolean}: if property and value applied can be used
             */
            result.setClasses = function () {
                var classesToAdd = '',
                    i;
                for (i in result) {
                    if (result.hasOwnProperty(i)) {
                        if (typeof result[i] !== 'function' && result[i]) {
                            classesToAdd += ' ' + i.toLowerCase();
                        }
                    }
                }
                window.document.documentElement.className += classesToAdd;
            };
            
            _merge(result, _checks.props, result.propCheck); // cycle through css property checks
            _merge(result, _checks.units, result.valCheck); // cycle through unit checks
            _merge(result, _checks.uas, result.uaCheck); // cycle through uaChecks and see if they're contained in the userAgent string
            return result;
            
        };

    return new _run();
    
}();