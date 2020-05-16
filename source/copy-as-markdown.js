/* global __INJECTIBLE_CODE__: readonly */

import TurndownService from 'turndown';
import {gfm} from 'turndown-plugin-gfm';

// Instantiate Turndown instance
const turndownService = new TurndownService({
	hr: '-',
	headingStyle: 'atx',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced'
});
turndownService.keep(['kbd', 'sup', 'sub']); // HTML content to retain in Markdown
turndownService.use(gfm);

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

// Action listener to redirect user to source repo
browser.browserAction.onClicked.addListener(() => {
	browser.tabs.create({
		url: 'https://github.com/notlmn/copy-as-markdown'
	});
});

// Add context menus for specific actions
const contexts = ['image', 'link', 'selection'];
for (const context of contexts) {
	browser.contextMenus.create({
		id: `cpy-as-md:${context}`,
		title: `Copy ${context} as Markdown`,
		contexts: [context]
	});
}

// Listener for events from context menus
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
			code: __INJECTIBLE_CODE__ // Replaced by webpack with actual code
		});

		htmlContent = completionData[0] || '';
	}

	const markdownData = turndownService.turndown(htmlContent);

	const inputElement = document.createElement('textarea');
	document.body.append(inputElement);
	inputElement.value = markdownData;
	inputElement.focus();
	inputElement.select();
	document.execCommand('Copy');
	inputElement.remove();
});
