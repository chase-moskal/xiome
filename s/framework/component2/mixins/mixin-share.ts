
import {Constructor} from "../component-types.js"

export function mixinShare<S>(s: S) {
	return function<C extends Constructor<{}>>(Base: C) {
		return class extends Base {
			get share() {
				return s
			}
		}
	}
}
