/* 
 * Client and Feature Detection Script
 * Leon Slater
 * http://mynamesleon.com
 */

(function () {
    'use strict';
    var i,
        navAgent = window.navigator.userAgent.toLowerCase(),
        div = window.document.createElement('div'),
        html = window.document.documentElement,
        img = new Image(),
        classStr = '',
        uaChecks = { // user agent values to check against
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
        propChecks = { // css properties to check against 
            perspective: ['perspective', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'], // translateZ support
            transform: ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'],
            transition: ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'],
            willChange: ['willChange'],
            animation: ['animation', 'WebkitAnimation', 'MozAnimation', 'OAnimation'],
            objectFit: ['objectFit'],
            objectPosition: ['objectPosition'],
            calc: ['calc', '-webkit-calc', '-moz-calc', '-o-calc']
        },
        unitChecks = {
            vw: '1vw',
            vh: '1vh',
            rem: '1rem',
            vmin: '1vmin',
            vmax: '1vmax'
        },
        returnVals = { // additional checks that don't neatly fit into css or user agent function checks
            safari: navAgent.indexOf('chrome') > -1 ? false : navAgent.indexOf('safari') > -1,
            retina: window.devicePixelRatio >= 1.5,
            pictureElem: typeof window.HTMLPictureElement !== 'undefined',
            srcsetBasic: typeof img.srcset !== 'undefined', // basic 1x / 2x descriptor use of srcset
            srcsetFull: typeof img.srcset !== 'undefined' && typeof img.sizes !== 'undefined', // full srcset use, including media queries
            requestAnimFrame: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
            cancelAnimFrame: window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame
        },
        uaCheck = function (val) {
            var expr = new RegExp(val, ['i']);
            return expr.test(navAgent);
        },
        propCheck = function (props, objProp) {
            var p,
                prop,
                isCalc;
            
            if (typeof props === 'string') { // if a string is passed in, separate it into an array first
                props = props.split(' ');
            }
            
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    prop = props[p];
                    isCalc = objProp === 'calc';
                    if (isCalc) {
                        div.style.cssText = 'width:' + prop + '(1px);';
                        if (div.style.length) {
                            return prop;
                        }
                    } else if (div.style[prop] !== undefined) {
                        return prop;
                    }
                }
            }
            return false;
        },
        valCheck = function (val, valStart) {
            valStart = valStart || 'width';
            div.style.cssText = valStart + ':' + val;
            if (div.style.length) {
                return true;
            }
            return false;
        },
        addToClassStr = function (check, classToAdd) {
            if (check) {
                classToAdd = classToAdd.toLowerCase();
                if (html.className.indexOf(classToAdd) === -1) {
                    classStr += ' ' + classToAdd;
                }
            }
        },
        funcsToExpose = function () { // functions to expose in the client object
            // polyfill for requestAnimationFrame and cancelAnimationFrame - adapted from original by Erik Moller
            if ((!returnVals.requestAnimFrame) || (!returnVals.cancelAnimFrame)) {
                var lastTime = 0;
                returnVals.requestAnimFrame = function (callback, element) {
                    var currTime = new Date().getTime(),
                        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                        id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
                returnVals.cancelAnimFrame = function (id) {
                    clearTimeout(id);
                };
            }
            
            // requires an array or space delimited string of css values: e.g. ['boxSizing', 'WebkitBoxSizing'] or 'boxSizing WebkitBoxSizing'
            // returns the first supported value in the sequence 
            returnVals.propCheck = function (valueArray) {
                return propCheck(valueArray);
            };

            // takes a string (which will be converted into a regular expression) to check against the userAgent 
            // e.g. 'firefox|chrome' will return true in both firefox and chrome
            returnVals.uaCheck = function (userAgentValue) {
                return uaCheck(userAgentValue);
            };
            
            // takes two arguments
            // 1 the value to apply to a CSS property
            // 2 the CSS property to apply the value from (1) to - uses 'width' by default
            // returns a boolean - if (1) can be applied to (2)
            returnVals.valCheck = function (val, startVal) {
                return valCheck(val, startVal);
            };
        };

    // cycle through uaChecks and see if they're contained in the userAgent string
    for (i in uaChecks) {
        if (uaChecks.hasOwnProperty(i)) {
            returnVals[i] = uaCheck(uaChecks[i]);
        }
    }
    
    for (i in unitChecks) {
        if (unitChecks.hasOwnProperty(i)) {
            returnVals[i] = valCheck(unitChecks[i], 'width');
        }
    }
    
    // create class string for checks so far
    for (i in returnVals) {
        if (returnVals.hasOwnProperty(i)) {
            addToClassStr(returnVals[i], i); // add prop name if supported
        }
    }

    // cycle through css property checks
    for (i in propChecks) {
        if (propChecks.hasOwnProperty(i)) {
            returnVals[i] = propCheck(propChecks[i], i);
            addToClassStr(returnVals[i], returnVals[i]); // add supported value to class string rather than prop name
        }
    }

    funcsToExpose();
    html.className += classStr;
    window.client = returnVals;
    
}());