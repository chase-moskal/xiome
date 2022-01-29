
import {LitElement} from "lit"
import {CSS} from "../types/component-types.js"
import {ConstructorFor} from "../../../types/constructor-for.js"

function arrayize<T>(item: T | T[]) {
	return <T[]>[item].flat()
}

const notUndefined = (x: any) => x !== undefined

function combineStyles(parentStyles: CSS, newStyles: CSS[]) {
	const styles = [
		...(arrayize(parentStyles) ?? []),
		...arrayize(newStyles),
	]
	return styles
		.flat()
		.filter(notUndefined)
}

export function mixinStyles(...newStyles: CSS[]) {
	return function<C extends ConstructorFor<LitElement>>(Base: C): C {
		return class extends Base {
			static styles = combineStyles(
				(<typeof LitElement><unknown>Base).styles,
				newStyles
			)
		}
	}
}
