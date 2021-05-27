
import {LitElement, PropertyValues} from "lit-element"
import {mixinAutowatcher} from "./mixins/mixin-autowatcher.js"
import {mixinInitiallyHidden} from "./mixins/mixin-initially-hidden.js"

export * from "lit-element"

export * from "./mixins/mixin-autotrack.js"
export * from "./mixins/mixin-autowatcher.js"
export * from "./mixins/mixin-focusable.js"
export * from "./mixins/mixin-initially-hidden.js"
export * from "./mixins/mixin-light-dom.js"
export * from "./mixins/mixin-share.js"
export * from "./mixins/mixin-styles.js"

export * from "./theme-components.js"
export * from "./register-components.js"

export class Component2 extends mixinAutowatcher(mixinInitiallyHidden(LitElement)) {
	init() {}
	firstUpdated(changes: PropertyValues) {
		this.init()
		super.firstUpdated(changes)
	}
}

export class Component2WithShare<xShare> extends Component2 {
	readonly share: xShare

	constructor() {
		super()
		if (this.share === undefined)
			throw new Error("component requires share")
	}
}

/////////

export class Component3 extends mixinInitiallyHidden(LitElement) {
	init() {}
	firstUpdated(changes: PropertyValues) {
		super.firstUpdated(changes)
		this.init()
	}
}

export class Component3WithShare<xShare> extends Component3 {
	readonly share: xShare

	constructor() {
		super()
		if (this.share === undefined)
			throw new Error("component requires share")
	}
}
