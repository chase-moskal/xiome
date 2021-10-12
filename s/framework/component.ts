
import {LitElement, PropertyValues, TemplateResult} from "lit"

import {LitBase} from "./component/types/component-types.js"
import {ConstructorFor} from "../types/constructor-for.js"
import {mixinAutowatcher} from "./component/mixins/mixin-autowatcher.js"
import {mixinInitiallyHidden} from "./component/mixins/mixin-initially-hidden.js"

export * from "lit"
export * from "lit/decorators.js"

export * from "./component/theme-components.js"
export * from "./component/register-components.js"

export * from "./component/mixins/mixin-autotrack.js"
export * from "./component/mixins/mixin-autowatcher.js"
export * from "./component/mixins/mixin-happy.js"
export * from "./component/mixins/mixin-focusable.js"
export * from "./component/mixins/mixin-initially-hidden.js"
export * from "./component/mixins/mixin-light-dom.js"
export * from "./component/mixins/mixin-snapstate.js"
export * from "./component/mixins/mixin-share.js"
export * from "./component/mixins/mixin-styles.js"
export * from "./component/mixins/mixin-ticker.js"

export class Component extends mixinInitiallyHidden(LitElement) {
	init() {}
	firstUpdated(changes: PropertyValues) {
		super.firstUpdated(changes)
		this.init()
	}

	#subscriptions: (() => () => void)[] = []
	addSubscription(subscribe: () => () => void) {
		this.#subscriptions.push(subscribe)
	}

	#unsubscribe = () => {}
	subscribe(): () => void {
		const unsubscribes = this.#subscriptions.map(s => s())
		return () => unsubscribes.forEach(u => u())
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
