
import {Constructor, AutowatchComponent} from "../component-types.js"
import {Track} from "../../../toolbox/autowatcher/types/watcher-types.js"

export function mixinAutotrack(...tracks: Track[]) {
	return function <C extends Constructor<AutowatchComponent>>(Base: C) {
		return class extends Base {
			constructor(...args: any[]) {
				super(...args)
				this.autotracks = [...this.autotracks, ...tracks]
			}
		}
	}
}
