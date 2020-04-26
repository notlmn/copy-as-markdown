import TurndownService from 'turndown';

const repoUrl = 'https://github.com/notlmn/copy-as-markdown';

browser.browserAction.onClicked.addListener(() => {
	browser.tabs.create({
		url: repoUrl
	});
});

const contexts = ['image', 'link', 'selection'];

for (const context of contexts) {
	browser.contextMenus.create({
		id: `cpy-as-md:${context}`,
		title: `Copy ${context} as Markdown`,
		contexts: [context]
	});
}

const turndownService = new TurndownService({
	headingStyle: 'atx',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced'
});

// HTML content to retain in Markdown
turndownService.keep(['kbd']);

// Workaround to fix #7 until https://github.com/domchristie/turndown/issues/291 gets fixed
turndownService.addRule('listItem', {
	filter: 'li',
	replacement: (content, node, options) => {
		content = content
			.replace(/^\n+/, '') // Remove leading newlines
			.replace(/\n+$/, '\n') // Replace trailing newlines with just a single one
			.replace(/\n/gm, '\n    '); // Indent

		let prefix = options.bulletListMarker + ' ';
		const parent = node.parentNode;
		if (parent.nodeName === 'OL') {
			const start = parent.getAttribute('start');
			const index = Array.prototype.indexOf.call(parent.children, node);
			prefix = (start ? Number(start) + index : index + 1) + '. ';
		}

		return (prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : ''));
	}
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
	const text = info.linkText;
	const assetUrl = encodeURI(info.srcUrl);
	const linkUrl = encodeURI(info.linkUrl);

	let htmlContent = '';

	if (info.menuItemId.endsWith('image')) {
		htmlContent = `<img alt="${text || assetUrl}" src="${assetUrl}" />`;
	} else if (info.menuItemId.endsWith('link')) {
		htmlContent = `<a href="${linkUrl}">${text || linkUrl}</a>`;
	} else if (info.menuItemId.endsWith('selection')) {
		const completionData = await browser.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `
				function getSelectionAsHTML() {
					const selection = document.getSelection();
					let containerTagName = '';

					if (selection.rangeCount === 0) {
						return '';
					}

					const selectionRange = selection.getRangeAt(0); // Only consider the first range
					const container = selectionRange.commonAncestorContainer;

					// All of text in container element is selected, then use parents tag
					if (selectionRange.toString().trim() === container.textContent.trim()) {
						// Handle plain text selections where parent is sometimes 'Node' or 'DocumentFragment'
						// Ideally, this should not happen, but text selection in browsers is unpredictable
						if (container instanceof Element) {
							containerTagName = container.tagName.toLowerCase();
						} else {
							containerTagName = 'p';
						}
					}

					const fragment = selectionRange.cloneContents();
					const wrapper = document.createElement('div');
					wrapper.appendChild(fragment);

					// Converts relative links to absolute links (#6)
					wrapper.querySelectorAll('a').forEach(link => link.href = link.href);

					if (containerTagName === '') {
						return wrapper.innerHTML;
					}

					// For preformatted tags, need to use <code> or it will not be considered as fenced code block
					if (containerTagName === 'pre') {
						return '<pre><code>' + wrapper.innerHTML + '</code></pre>';
					}

					return '<' + containerTagName + '>' + wrapper.innerHTML + '</' + containerTagName + '>';
				}

				getSelectionAsHTML();
			`
		});

		htmlContent = completionData[0] || '';
	}

	const mdData = turndownService.turndown(htmlContent);

	const inputElement = document.createElement('textarea');
	document.body.append(inputElement);
	inputElement.value = mdData;
	inputElement.focus();
	inputElement.select();
	document.execCommand('Copy');
	inputElement.remove();
});
