# <img src="source/copy-as-markdown.png" width="45" align="left"> Copy as Markdown

> Browser extension to copy hyperlinks, images, and selected text as Markdown

Inspired from [this tweet](https://twitter.com/NicoloRibaudo/status/1143521181196345346) by [@nicolo-ribaudo](https://github.com/nicolo-ribaudo).


## Install

- [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/nlaionblcaejecbkcillglodmmfhjhfi.svg?label=%20">][link-cws]
- [**Firefox** add-on][link-amo] [<img valign="middle" src="https://img.shields.io/amo/v/cpy-as-md.svg?label=%20">][link-amo]


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

> **_Note_**: When copying links and images, Chrome doesn’t let you extract images alt text or anchors text content to be used in Markdown, instead the links themselves are used as link title. Firefox doesn’t have this limitation though.


### Permissions

The extension requires the following permission from you for working.

1. `contextMenus`: to show option when right-clicking.
1. `activeTab`: to be able to access content on page.
1. `clipboardWrite`: to be able to write data to clipboard (we still can’t read from your clipboard).


## License

[MIT](license) &copy; Laxman Damera


[link-amo]: https://addons.mozilla.org/en-US/firefox/addon/cpy-as-md/
[link-cws]: https://chrome.google.com/webstore/detail/copy-as-markdown/nlaionblcaejecbkcillglodmmfhjhfi/
