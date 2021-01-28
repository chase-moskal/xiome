
import {LitElement} from "lit-element"
import {ConstructorFor} from "../../types.js"

const _unsubscribe = Symbol("_unsubscribe")

export function mixinSubscribe<C extends ConstructorFor<LitElement>>(
		Constructor: C
	): C {
	return class Component extends Constructor {

		[_unsubscribe] = () => {}

		subscribe() {
			return () => {}
		}

		connectedCallback() {
			this[_unsubscribe] = this.subscribe()
			super.connectedCallback()
		}

		disconnectedCallback() {
			this[_unsubscribe]()
			super.disconnectedCallback()
		}
	}
}
