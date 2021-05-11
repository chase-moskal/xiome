
import {CSS, LitBaseClass} from "../component-types.js"

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
	return function<C extends LitBaseClass>(Base: C) {
		return class extends Base {
			static styles = combineStyles(Base.styles, newStyles)
		}
	}
}
