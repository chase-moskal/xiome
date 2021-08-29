
import {ComponentBaseWithShare, Constructor} from "../types/component-types.js"

export function mixinShare<S>(s: S) {
	return function<C extends Constructor<ComponentBaseWithShare<S>>>(Base: C) {
		return class extends Base {
			get share() {
				return s
			}
		}
	}
}
