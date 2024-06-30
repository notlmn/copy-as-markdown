// Chrome does not support the browser namespace yet.
if (typeof browser === 'undefined') {
	globalThis.browser = chrome;
}

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

	let actionType = 'selection';
	let htmlContent = '';

	if (info.menuItemId.endsWith('image')) {
		actionType = 'image';
		htmlContent = `<img alt="${text || assetUrl}" src="${assetUrl}" />`;
	} else if (info.menuItemId.endsWith('link')) {
		actionType = 'link';
		htmlContent = `<a href="${linkUrl}">${text || linkUrl}</a>`;
	}

	try {
		await browser.tabs.sendMessage(tab.id, {
			actionType,
			htmlContent
		});
	} catch (error) {
		console.error(error);
	}
});

// Listener for events from keyboard shortcuts
browser.commands.onCommand.addListener(async command => {
	if (command === 'copy-selection-as-md') {
		try {
			const tabs = await browser.tabs.query({active: true});
			if (tabs.length === 0) {
				return;
			}

			await browser.tabs.sendMessage(tabs[0].id, {
				actionType: 'selection',
				htmlContent: ''
			});
		} catch (error) {
			console.error(error);
		}
	}
});
