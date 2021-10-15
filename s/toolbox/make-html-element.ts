
export function makeHtmlElement<E extends HTMLElement>(
		tag: string,
		attributes: {[key: string]: string},
	): E {

	const element = document.createElement(tag) as E

	for (const [key, value] of Object.entries(attributes))
		element.setAttribute(key, value)

	return element
}
