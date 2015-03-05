/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~         Client and Feature Detection Script         ~~
~~           Leon Slater, www.lpslater.co.uk           ~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

window.client = (function () {
    var navAgent = navigator.userAgent.toLowerCase(),
        div = document.createElement('div'),
        img = new Image(),
        html = document.documentElement,
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
            calc: ['calc', '-webkit-calc', '-moz-calc', '-o-calc']
        },
        returnVals = { // additional checks that don't neatly fit into css or user agent function checks
            safari: navAgent.indexOf('chrome') > -1 ? false : navAgent.indexOf('safari') > -1,
            retina: window.devicePixelRatio >= 1.5,
            pictureElem: window.HTMLPictureElement !== undefined,
            srcsetBasic: 'srcset' in img, // basic 1x / 2x descriptor use of srcset
            srcsetFull: 'srcset' in img && 'sizes' in img, // full srcset use, including media queries
            requestAnimFrame: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
            cancelAnimFrame: window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame
        },
        uaCheck = function (val) {
            var expr = new RegExp(val, ['i']);
            return expr.test(navAgent);
        },
        cssCheck = function (props, objProp) {
            if (typeof props === 'string') { // if a string is passed in, separate it into an array first
                props = props.split(' ');
            }
            for (var i in props) {
                var isCalc = objProp === 'calc';
                if (isCalc) {
                    div.style.cssText = 'width:' + props[i] + '(1px);';
                    if (div.style.length) {
                        return props[i];
                    }
                    continue;
                }
                if (div.style[props[i]] !== undefined) {
                    return props[i];
                }
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
            returnVals.cssCheck = function (valueArray) {
                return cssCheck(valueArray);
            };

            // takes a string (which will be converted into a regular expression) to check against the userAgent 
            // e.g. 'firefox|chrome' will return true in both firefox and chrome
            returnVals.uaCheck = function (userAgentValue) {
                return uaCheck(userAgentValue);
            };
        };

    // cycle through uaChecks and see if they're contained in the userAgent string
    for (var s in uaChecks) {
        returnVals[s] = uaCheck(uaChecks[s]);
    }

    // create class string for checks so far
    for (var u in returnVals) {
        addToClassStr(returnVals[u], u); // add prop name if supported
    }

    // cycle through css property checks
    for (var p in propChecks) {
        returnVals[p] = cssCheck(propChecks[p], p);
        addToClassStr(returnVals[p], returnVals[p]); // add supported value to class string rather than prop name
    }

    funcsToExpose();
    html.className += classStr;

    return returnVals;
}());