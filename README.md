# Browser and Feature Detection script

A tiny standalone browser and feature detection script.

It also includes polyfills for the Request and Cancel Animation Frame functions, and exposes a couple of additional functions to allow custom userAgent and CSS Property checks.

These checks are made available via a "client" object in the window.

## The built in checks

Each of these is listed with the property name in the client object, e.g. `client.IE7`

### Browser / Device detection:
These properties are booleans.
- IE7
- IE8
- IE9
- IE10
- IE11
- oldIE (IE7 or IE8),
- IE (any of the above)
- edge
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
- desktop (not android, webos, ios, blackberry, windows phone, or iemobile)
- mac

These are dependent on the browser's user agent string, so should not be relied on. They can also report some false positives. For instance, recent versions of Opera like to think that they are Chrome (because they pretty much are...), and likewise Microsoft Edge includes the words "Chrome" and "Safari" in its user agent string.

### CSS property detection:
These return the supported CSS property as a string (e.g. 'WebkitPerspective'). If unsupported, the property will return false.
- perspective (can be used to check translateZ or translate3d support)
- transition
- transform
- willChange
- animation
- objectFit
- objectPosition
- calc (not technically a CSS property in itself, but still useful to check for)

### CSS Unit detection
These properties are also booleans.
- vh
- vw
- vmin
- vmax
- rem

### Additional features
- canvas (checks for support of the canvas element)
- retina (boolean - true if devicePixelRatio >= 1.5)
- pictureElem (boolean - checks for `<picture>` element support)
- srcsetBasic (boolean - checks for basic use of the img 'srcset' attribute with x descriptors for high pixel density displays)
- srcsetFull (boolean - checks for full support of the img 'srcset' attribute with the use of media queries)

### Methods

##### setClasses
Calling `client.setClasses()` will cycle through all of the `client` properties and add the property name as a lowercase class to the HTML tag as long as the property is not false, or a function.

##### requestAnimFrame
The `client.requestAnimFrame` function uses the browser's native requestAnimationFrame if supported, or a polyfill if not. This will return an ID which can be passed into `client.cancelAnimFrame` to cancel the function call.

##### cancelAnimFrame
The `client.cancelAnimFrame` function also uses the browser's native cancelAnimationFrame, or a polyfill if unsupported.

##### uaCheck
`client.uaCheck` takes a string which it checks against the browser's userAgent string, and returns a boolean. You can also include basic regex here. E.g. `client.uaCheck('chrome|firefox')` will return true in both Chrome and Firefox. This function simply checks for the existence of the string, so `client.uaCheck('chro')` will also return true in Chrome.

##### propCheck
`client.propCheck` takes either a string of space delimited properties to check for, or an array of properties. E.g. `client.propCheck('borderRadius WebkitBorderRadius')` or `client.propCheck(['borderRadius', 'WebkitBorderRadius'])`. This checks whether or not the properties are supported on a `<div>`, and will return the **first supported value** in the sequence, or false if none are supported. E.g. `client.propCheck('OBorderRadius MozBorderRadius WebkitBorderRadius borderRadius')` would return 'WebkitBorderRadius' in current Chrome.

##### valCheck
`client.valCheck` takes two strings: a CSS property, and a value to check against it. It can also take one string: the value to use, which will be checked against the width property. These checks will be made on a `<div>`, and returns a boolean.

This can have multiple purposes, such as checking if a particular unit is supported, e.g. `client.valCheck('font-size', '10rem')`. It can also be used to check that a CSS property supports a particular value, e.g. `client.valCheck('will-change', 'all')`. And, if you don't want to use the `client.propCheck` function, `client.valCheck` can also be used as a property check for a **single** property, e.g. `client.valCheck('-moz-border-radius', '10px')`.

## Contributing

By all means, feel free to add your own checks to the source code if you think they'd be of use - the sections for each of the checks are clearly labelled in their respective objects in the non-minified script inside the `_checks` object: `uas` for userAgent checks, `props` for CSS property checks, `units` for CSS unit checks, and `unique` any unique checks that either don't fit into those categories or require extra logic.

In the interest of simplicity (and reduced file size!), I've deliberately only added values, units, and browser checks that I'm likely to actually need to check for.
