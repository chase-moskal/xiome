
import {LitElement} from "lit-element"
export * from "lit-element"

import {mixinAutowatcher} from "./mixins/mixin-autowatcher.js"

export class Component2 extends mixinAutowatcher()(LitElement) {}

export class Component2WithShare<xShare> extends Component2 {
	readonly share: xShare

	connectedCallback() {
		super.connectedCallback()
		if (this.share === undefined)
			throw new Error("component requires share")
	}
}

// export class ExampleImplementationForComponent extends Component2WithShare<{a: true}> {
// 	#lol = () => {
// 		this.share.a
// 		this.auto.observables({})
// 	}
// }

// import {mixinShare} from "./mixins/mixin-share.js"
// import {autowatcher} from "../../toolbox/autowatcher/autowatcher.js"
// import {mixinAutotracking, mixinAutowatcher} from "./mixins/mixin-autowatcher.js"

// const auto = autowatcher()
// export class ExampleComponentForTestingTypes extends mixinShare({a: true})(mixinAutotracking(auto.track)(Component2)) {
// 	#state = this.auto.observables({})
// 	#actions = this.auto.actions({})
// 	#lol = this.share.a
// 	#lol2 = this.autotracks

// 	firstUpdated() {
// 		this.requestUpdate()
// 	}
// }
