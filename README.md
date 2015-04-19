# Browser and Feature Detection script

A small (under 3kb minified) standalone browser and feature detection script.

It also includes polyfills for the Request and Cancel Animation Frame functions, and exposes a couple of additional functions to allow custom userAgent and CSS Property checks.

These checks are made available via a "client" object in the window, and any supported properties built into the script will be added as lowercase classes to the HTML tag.

## The built in checks

Each of these is listed with the property name in the client object, e.g. `client.IE7`

### Browser / Device detection:
These properties are booleans. If true, the property will be added as a lowercase class to the HTML tag.
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
- desktop (not android, webos, ios, blackberry, windows phone, or iemobile)
- mac

### CSS property detection:
These return the supported CSS property (and add it as a lowercase class to the HTML tag, e.g. 'webkitperspective'). If unsupported, the property will return false.
- perspective (can be used to check translateZ or translate3d support)
- transition
- transform
- willChange
- animation
- objectFit
- objectPosition
- calc (not technically a CSS property in itself, but still useful to check for)

### CSS Unit detection
These properties are also booleans. If true, the property will be added as a lowercase class to the HTML tag.
- vh
- vw
- vmin
- vmax
- rem

### Additional features
- retina (boolean - true if devicePixelRatio >= 1.5)
- pictureElem (boolean - checks for `<picture>` element support)
- srcsetBasic (boolean - checks for basic use of the img 'srcset' attribute with x descriptors for high pixel density displays)
- srcsetFull (boolean - checks for full support of the img 'srcset' attribute with the use of media queries)

### Functions

##### requestAnimFrame 
The `client.requestAnimFrame` function uses the native requestAnimationFrame if supported, or a polyfill if not. It must be called in the context of the window to prevent an error, e.g. `client.requestAnimFrame.call(window, functionCall)`

##### cancelAnimFrame 
The `client.cancelAnimFrame` function uses the native cancelAnimationFrame, or a polyfill if unsupported. As above, it must be called in the context of the window to prevent an error, e.g. `client.cancelAnimFrame.call(window, functionCall)`
- uaCheck (function)

##### uaCheck
`client.uaCheck` takes a string which it checks against the browser's userAgent string, and returns a boolean. You can also include basic regex here. E.g. `client.uaCheck('chrome|firefox')` will return true in both Chrome and Firefox. This function simply checks for the existence of the string, so `client.uaCheck('chro')` will also return true in Chrome.

##### propCheck
`client.propCheck` takes either a string of space delimited properties to check for, or an array of properties. E.g. `client.propCheck('borderRadius WebkitBorderRadius')` or `client.propCheck(['borderRadius', 'WebkitBorderRadius'])`. This checks whether or not the properties are supported on a `<div>`, and will return the **first supported value** in the sequence, or false if none are supported. E.g. `client.propCheck('OBorderRadius MozBorderRadius WebkitBorderRadius borderRadius')` would return 'WebkitBorderRadius' in current Chrome.

##### valCheck
`client.valCheck` takes two strings: the CSS value to check, and the CSS property to check it against (the property is set to width by default if nothing is passed in) - these checks will be made on a `<div>`, and returns a boolean. This can have multiple purposes, such as checking if a particular unit is supported, e.g. `client.valCheck('10rem', 'font-size')`. It can also be used to check that a CSS property supports a particular value, e.g. `client.valCheck('all', 'will-change')`. And, if you don't want to use the `client.propCheck` function, `client.valCheck` can also be used as a property check for a **single** property, e.g. `client.valCheck('10px', '-moz-border-radius')`.

## Contributing

By all means, feel free to add your own checks to the source code if you think they'd be of use - the sections for each of the checks are clearly labelled in their respective objects in the non-minified script: `uaChecks` for userAgent checks, `propChecks` for CSS property checks, `unitChecks` for CSS unit checks, and any unique checks that don't fit into those categories are within the `returnVals` object.

In the interest of simplicity (and reduced file size!), I've deliberately only added values, units, and browser checks that I'm likely to actually need to check for.