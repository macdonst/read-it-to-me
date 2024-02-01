# read-it-to-me

> A web component that will read content out to you using the web speech API.

Live demo available [here](https://simonmacdonald.com/blog/posts/2024-02-01-read-it-to-me-component).

## Including the component to an HTML file

1. Import custom element:

### Unpkg

```html
<script type="module" src="https://unpkg.com/read-it-to-me/read-it-to-me.js?module=true"></script>
```

### Snowpack

```html
<script type="module" src="https://cdn.skypack.dev/read-it-to-me"></script>
```

2. Start using it!

```html
<read-it-to-me>
    Read it to me!
</read-it-to-me>
```

## Including the component from NPM

1. Install `read-it-to-me` NPM package:

```console
npm i read-it-to-me
```

2. Import custom element:

```javascript
import { ReadItToMe } from 'read-it-to-me'
```

3. Include that `script` tag in your HTML.
4. Start using it:

```html
<read-it-to-me>
    Read it to me!
</read-it-to-me>
```

## Attributes

`pitch` - A float representing the pitch value. It can range between 0 (lowest) and 2 (highest), with 1 being the default pitch for the current platform or voice.
`rate` - A float representing the rate value. It can range between 0.1 (lowest) and 10 (highest), with 1 being the default rate for the current platform or voice, which should correspond to a normal speaking rate.
`lang` - A string representing a BCP 47 language tag, with the default of `en-US`.

## CSS Custom Properties

`--ritm-color` - background color of button, default #AD6EF9
`--ritm-active` - color of active button text, black
`--ritm-text` - color of button text, default white
`--ritm-top` - margin block start value for player controls, default 0em
