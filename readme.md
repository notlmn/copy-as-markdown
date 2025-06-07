# <img src="source/copy-as-markdown.png" width="45" align="left"> Copy as Markdown

> Browser extension to copy hyperlinks, images, and selected text as Markdown to your clipboard

## Install

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/nlaionblcaejecbkcillglodmmfhjhfi.svg?label=%20">][link-chrome] and other Chromium browsers

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" width="48" alt="Firefox" valign="middle">][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/cpy-as-md.svg?label=%20">][link-firefox] including Firefox Android

## Screenshot

![Copy as Markdown](media/screenshot-1280x800.png)

## Features

The extension allows you to copy selected text on a page as Markdown with support for features including the following

- Ability to copy links, images, and selected text as Markdown.
- Linked images, will have options to individually select link or images.
- Formatted text such as _italic_, **bold**, ~~strike-through~~, and `inline code`.
- Unordered and ordered lists, with [task lists](https://github.github.com/gfm/#task-list-items-extension-) support.
- Tables, with respect to [GFM](https://github.github.com/gfm/#tables-extension-).
- Fenced code blocks, with language detection using [info strings](https://github.github.com/gfm/#example-112).
- MathML to LaTeX conversion, using [mathml-to-latex](https://github.com/asnunes/mathml-to-latex) (delimited by `$` and `$$` for inline and block rendering respectively).

### Permissions

The extension requires the following permission from you for working.

1. `contextMenus`: to show option when right-clicking.
1. `activeTab`: to be able to access content on page.

### Known Issues

#### Security Considerations

Copying to clipboard might not work in some of the following scenarios:

- You are on an insecure page (URL starts with `http://` instead of `https://`).
- You have not interacted with the page yet.

These are a result of the software design decisions made to protect the user from bad actors. The MDN article section ["Security Considerations"][link-security-considerations] lists what these limitations are and why they exist.

More info can be found on MDN about [User Activation](link-transient-activation) and [Secure Contexts][link-secure-contexts].

#### Copying Embedded Content

Web pages sometimes embed content from other page using an [`iframe`](http://mdn.io/iframe). Due to security considerations around accessing and modifying clipboard (see section above), this extension doesn't work if you try to copy text from inside these frames.

#### Edge cases in Chromium Browsers

When copying links and images, Chrome doesn’t let you extract images alt text or anchors text content to be used in Markdown, instead the links themselves are used as link title. Firefox doesn’t have this limitation.

## Credits

- Idea from [this tweet](https://twitter.com/NicoloRibaudo/status/1143521181196345346) by [@nicolo-ribaudo](https://github.com/nicolo-ribaudo).
- Publishing made possible by [@yakov116](https://github.com/yakov116).

## Related

- [browser-extension-template](https://github.com/notlmn/browser-extension-template) - Barebones boilerplate with webpack, options handler and auto-publishing.

## License

[MIT](license)

[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/cpy-as-md
[link-chrome]: https://chromewebstore.google.com/detail/copy-as-markdown/nlaionblcaejecbkcillglodmmfhjhfi
[link-security-considerations]: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security_considerations
[link-transient-activation]: https://developer.mozilla.org/en-US/docs/Web/Security/User_activation
[link-secure-contexts]: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
