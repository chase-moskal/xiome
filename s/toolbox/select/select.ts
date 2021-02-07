
export function select<H extends HTMLElement = HTMLElement>(
		selector: string,
		context: any = document
	): H {
	return context.querySelector(selector)
}
