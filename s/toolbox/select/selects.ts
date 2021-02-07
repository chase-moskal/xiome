
export function selects<H extends HTMLElement = HTMLElement>(
		selector: string,
		context: any = document
	): H[] {
	return Array.from(context.querySelectorAll(selector))
}
