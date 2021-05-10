
import {CSS, LitBaseClass} from "../component-types.js"

function arrayize<T>(item: T | T[]) {
	return <T[]>[item].flat()
}

export function mixinStyles(...styles: CSS[]) {
	return function<C extends LitBaseClass>(Base: C) {
		return class extends Base {
			static styles = [
				...(arrayize(Base.styles) ?? []),
				...arrayize(styles),
			].flat()
		}
	}
}
