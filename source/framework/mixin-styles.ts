
import {ConstructorFor} from "../types.js"
import {LitElement, CSSResult, CSSResultArray} from "lit-element"

export type CSS = CSSResult | CSSResultArray | CSSStyleSheet
export type LitElementConstructor = ConstructorFor<LitElement> & {styles?: CSS}

const arrayize = <T>(item: T | T[]): T[] =>
	Array.isArray(item)
		? item
		: [item]

const stylize = (
		...styleses: CSS[]
	): CSSResultArray => {
	let final: CSSResultArray = []
	for (const styles of styleses)
		final = [...final, ...arrayize(styles || [])]
	return final
}

export function mixinStyles(style: CSS, ...moreStyles: CSS[]) {
	return function mixinStylesActual<
			C extends LitElementConstructor
		>(Constructor: C): C & {styles: CSSResultArray} {
		return class LitElementWithStyle extends Constructor {
			static styles = stylize(Constructor.styles, ...[style, ...moreStyles])
		}
	}
}
