# Browser and Feature Detection script

A tiny standalone browser and feature detection script.

The checks are made available via a `client` object exposed at window level. It also includes polyfills for the Request and Cancel Animation Frame functions, and exposes some helpful methods for doing checks of your own.

Version 1 ran all the checks as soon as possible and stored the result, but this meant that there was unnecessary processing on load. So version 2 only runs its checks when you need them.

## The built in checks

Every built in property on the `client` object is a method, so must always be called as a function. When it is first called, the check will be made and the result is cached internally. Any subsequent calls are then grabbed from the cache.

Each of these is listed with the method name in the client object, e.g. `client.IE7();`

### Browser / Device detection:
These will return booleans.
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

These are dependent on the browser's user agent string, so should not be relied on. They can also report some false positives. For instance, recent versions of Opera like to think that they are Chrome (because they pretty much are...), so `client.chrome()` will return true in them, and likewise Microsoft Edge includes the words "Chrome" and "Safari" in its user agent string.

### CSS property detection:
These will return the supported CSS property as a string (e.g. 'WebkitPerspective'). If unsupported, they will return false.
- perspective (can be used to check translateZ or translate3d support)
- transition
- transform
- willChange
- animation
- objectFit
- objectPosition
- calc (not technically a CSS property in itself, but still useful to check for)

### CSS Unit detection
These will return booleans.
- vh
- vw
- vmin
- vmax
- rem

### Additional features
These all return booleans.
- canvas - checks for support of the canvas element (and two-dimensional rendering context for it)
- retina - true if devicePixelRatio >= 1.5
- pictureElem - checks for `<picture>` element support
- srcsetBasic - checks for basic use of the img 'srcset' attribute with x descriptors for high pixel density displays
- srcsetFull - checks for full support of the img 'srcset' attribute with the use of media queries

### Methods

##### addTest
The `client.addTest(key, test)` method is useful for adding your own tests to the `client` object which, when called, will be cached internally. The first parameter is the key for it to be included under in the client object, and the second is the test you wish to run. You can of course add them directly to the client object by doing `client.someName = function() { /* some code */ }` if you prefer.

##### setClasses
Calling `client.setClasses()` will cycle through all of the `client` checks and add the key as a lowercase class to the `<html>` tag as long as the check returns a truthy value. By default this will automatically run (and cache the results if it is an internal check, or was added via the `addTest` method) any checks that have not yet been called. If you wish to only add classes for checks that have already been run and cached internally, then you can pass in `false` like so: `client.setClasses(false)`.

All of the keys for the methods mentioned in this section are specifically ignored by the `setClasses` method, so will not be added as classes to the `<html>` tag.

##### requestAnimFrame
The `client.requestAnimFrame(functionName)` function uses the browser's native requestAnimationFrame if supported, or a polyfill (adapted from Erik Moller's) if not. This will return an ID which can be passed into `client.cancelAnimFrame(id)` to cancel the function call.

##### cancelAnimFrame
The `client.cancelAnimFrame(id)` function also uses the browser's native cancelAnimationFrame, or a polyfill if unsupported.

##### uaCheck
`client.uaCheck` takes a string which it converts to a regular expression to do a case-insensitive check against the browser's userAgent string to return a boolean. E.g. `client.uaCheck('chrome|firefox')` will return true in both Chrome and Firefox.
Note: this function simply checks for the existence of the string, so `client.uaCheck('chro')` will also return true in Chrome.
Note: checks against the user agent should only be relied on as a last resort. Proper feature detection is much more reliable.

##### propCheck
`client.propCheck` takes either a string of space delimited properties to check for, or an array of properties. E.g. `client.propCheck('borderRadius WebkitBorderRadius')` or `client.propCheck(['borderRadius', 'WebkitBorderRadius'])`. This will return the **first supported value** in the sequence, or false if none are supported. E.g. `client.propCheck('OBorderRadius MozBorderRadius WebkitBorderRadius borderRadius')` would return 'WebkitBorderRadius' in current Chrome.

The checks are made on a `<div>` by default, but you can optionally pass in a second parameter to check the style properties against a specific element. E.g. `client.propCheck(['borderRadius', 'WebkitBorderRadius'], document.createElement('canvas'))`

##### valCheck
`client.valCheck` is used to see if a value is supported for a specific CSS property. The check is made on a `<div>` by default and returns a boolean. The method can take one, two, or three parameters:
- If one is provided, it must be a string, which will be checked as a value against the width property. E.g. `client.valCheck('10rem')`
- If two are provided, they must both be strings. The first will be taken to be the CSS property, and the second the value to check against it. E.g. `client.valCheck('font-size', '10rem')`
- If three are provided, it works in the same way as if two are provided, but the third is a custom element to run the check on. E.g. `client.valCheck('font-size', '10rem', document.createElement('canvas'))`.

This can have multiple purposes, such as checking if a particular unit is supported, or if a CSS property supports a particular value, e.g. `client.valCheck('will-change', 'all')`. And, if you don't want to use the `client.propCheck` function, `client.valCheck` can also be used as a property check for a **single** property, e.g. `client.valCheck('-moz-border-radius', '10px')`.

## Contributing

Feel free to add your own checks to the source code if you think they'd be of use - the sections for each of the checks are clearly labelled in their respective objects in the non-minified script inside the `_checks` object: `uas` for userAgent checks, `props` for CSS property checks, `units` for CSS unit checks, and `unique` for any unique checks that either don't fit into those categories or require extra logic.

In the interest of simplicity (and reduced file size!), I've deliberately only added values, units, and browser checks that I'm likely to actually need to check for.

For more complex and unique checks that shouldn't really be part of the code base, hopefully the included methods mentioned above will be of use to you.
