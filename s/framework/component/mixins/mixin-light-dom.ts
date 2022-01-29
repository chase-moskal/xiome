
import {LitElement} from "lit"
import {Constructor} from "../../../types/constructor.js"

export function mixinLightDom<C extends Constructor<LitElement>>(
		Base: C
	): C {

	return class extends Base {
		createRenderRoot() {
			return this
		}
	}
}
