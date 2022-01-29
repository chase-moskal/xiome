
import {LitElement} from "lit"
import {ConstructorFor} from "../../../types/constructor-for.js"

export function mixinLightDom<C extends ConstructorFor<LitElement>>(
		Base: C
	): C {

	return class extends Base {
		createRenderRoot() {
			return this
		}
	}
}
