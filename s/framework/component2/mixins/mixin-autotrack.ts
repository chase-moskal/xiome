
import {Constructor, AutowatchComponent} from "../component-types.js"
import {Track} from "../../../toolbox/autowatcher/types/autowatcher-types.js"

export function mixinAutotrack(...tracks: Track<any>[]) {
	return function <C extends Constructor<AutowatchComponent>>(Base: C) {
		return class extends Base {
			constructor(...args: any[]) {
				super(...args)
				for (const track of tracks)
					this.subscribeAutotrack(track)
			}
		}
	}
}
