
/**
 * Select a single dom element
 */
export function select<H extends HTMLElement = HTMLElement>(
	selector: string,
	context: any = document
): H {
	return context.querySelector(selector)
}

/**
 * Select multiple dom elements
 */
export function selects<H extends HTMLElement = HTMLElement>(
	selector: string,
	context: any = document
): H[] {
	return Array.from(context.querySelectorAll(selector))
}
