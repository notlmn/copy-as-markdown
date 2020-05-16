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

	// For tables, remove all immediate child nodes that are not required
	const tables = wrapper.querySelectorAll('table');
	for (const table of tables) {
		const floaters = Array.from(table.children).filter(node => !['THEAD', 'TBODY', 'TR', 'TFOOT'].includes(node.tagName));
		for (const floater of floaters) {
			floater.parentNode.removeChild(floater);
		}
	}

	if (containerTagName === '') {
		return wrapper.innerHTML;
	}

	// For preformatted tags, content needs to be wrapped inside `<code>`
	// or it would not be considered as fenced code block
	if (containerTagName === 'pre') {
		// Classes of parent or container node can be used by GFM plugin to detect language
		const classes = (container.parentNode || container).classList.toString();

		return `
			<div class="${classes}">
				<pre><code>${wrapper.innerHTML}</code></pre>
			</div>
		`;
	}

	return '<' + containerTagName + '>' + wrapper.innerHTML + '</' + containerTagName + '>';
}

getSelectionAsHTML();
