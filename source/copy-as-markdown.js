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

turndownService.keep(['kbd']); // HTML content to retain in Markdown

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
						containerTagName = container.tagName.toLowerCase();
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
