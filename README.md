# Browser and Feature Detection script

A small (just over 2kb minified) standalone browser and feature detection script.

It also includes polyfills for the Request and Cancel Animation Frame functions, and exposes a couple of additional functions to allow custom userAgent and CSS Property checks.

These checks are made available via a "client" object in the window, and any supported properties built into the script will be added as classes to the HTML tag.

## The built in checks

Each of these is listed with the property name in the client object, e.g. `client.IE7`

#### Browser / Device detection:
- IE7
- IE8
- IE9
- IE10
- IE11
- oldIE (IE7 or IE8),
- IE (any of the above)
- chrome
- firefox
- opera
- safari
- iPad
- iPhone
- iPod
- iOS
- android
- windowsPhone
- mobile (android, webos, ios, blackberry, windows phone, iemobile)
- mac

#### CSS property detection:
If supported, these return the supported property e.g. 'WebkitPerspective'
- perspective (can be used to check translateZ or translate3d support)
- transition
- transform
- willChange
- calc (not technically a CSS property in itself, but still useful to check for)

#### Additional features
- retina (checks for a devicePixelRatio >= 1.5)
- pictureElem (support of the `<picture>` element)
- srcsetBasic (basic use of the img 'srcset' attribute with x descriptors for high pixel density displays)
- srcsetFull (full support of the img 'srcset' attribute with the use of media queries)
- requestAnimFrame (the browsers native requestAnimationFrame function, or a polyfill if unsupported)
- cancelAnimFrame (the browsers native cancelAnimationFrame function, or a polyfill if unsupported)

## Creating your own checks

The script exposes two additional functions via the client object: `client.uaCheck(stringToCheck)` and `client.cssCheck(stringOrArray)`

`client.uaCheck` takes a string which it checks against the browser's userAgent string. You can also include basic regex here. E.g. `client.uaCheck('chrome|firefox')` will return true in both Chrome and Firefox. This function simply checks for the existence of the string, so `client.uaCheck('chro')` will also return true in Chrome.

`client.cssCheck` takes either a string of space delimited properties to check for, or an array of properties. E.g. `client.cssCheck('borderRadius WebkitBorderRadius')` or `client.cssCheck(['borderRadius', 'WebkitBorderRadius'])`. This checks whether or not the properties are supported on a `<div>`, and will return the first supported value in the sequence, or false if none are supported. E.g. `client.cssCheck('OBorderRadius MozBorderRadius WebkitBorderRadius borderRadius')` would return 'WebkitBorderRadius' in current Chrome.