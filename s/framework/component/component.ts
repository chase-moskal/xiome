
import {LitElement, PropertyValues, TemplateResult} from "lit-element"

import {LitBase} from "./types/component-types.js"
import {ConstructorFor} from "../../types/constructor-for.js"
import {mixinAutowatcher} from "./mixins/mixin-autowatcher.js"
import {mixinInitiallyHidden} from "./mixins/mixin-initially-hidden.js"

export * from "lit-element"
export {render} from "lit-html"

export * from "./theme-components.js"
export * from "./register-components.js"

export * from "./mixins/mixin-autotrack.js"
export * from "./mixins/mixin-autowatcher.js"
export * from "./mixins/mixin-happy.js"
export * from "./mixins/mixin-focusable.js"
export * from "./mixins/mixin-initially-hidden.js"
export * from "./mixins/mixin-light-dom.js"
export * from "./mixins/mixin-madstate.js"
export * from "./mixins/mixin-share.js"
export * from "./mixins/mixin-styles.js"
export * from "./mixins/mixin-ticker.js"

export class Component extends mixinInitiallyHidden(LitElement) {
	init() {}
	firstUpdated(changes: PropertyValues) {
		super.firstUpdated(changes)
		this.init()
	}

	#unsubscribe = () => {}
	subscribe(): () => void {
		return () => {}
	}
	connectedCallback() {
		super.connectedCallback()
		this.#unsubscribe = this.subscribe()
	}
	disconnectedCallback() {
		super.disconnectedCallback()
		this.#unsubscribe()
		this.#unsubscribe = () => {}
	}

	render(): TemplateResult {
		throw new Error("component render method not implemented")
	}
}

export class ComponentWithShare<xShare> extends Component {
	readonly share: xShare

	constructor() {
		super()
		if (this.share === undefined)
			throw new Error("component requires share")
	}
}

export class AutowatcherComponent extends mixinAutowatcher(mixinInitiallyHidden(<ConstructorFor<LitBase>>(<any>LitElement))) {
	init() {}
	firstUpdated(changes: PropertyValues) {
		this.init()
		super.firstUpdated(changes)
	}
}

export class AutowatcherComponentWithShare<xShare> extends AutowatcherComponent {
	readonly share: xShare

	constructor() {
		super()
		if (this.share === undefined)
			throw new Error("component requires share")
	}
}
