
import {MobxLitElement} from "@adobe/lit-mobx"

import {Share} from "./component/share.js"
import {mixinSubscribe} from "./component/mixin-subscribe.js"
import {mixinMobxAutorun} from "./component/mixin-mobx-autorun.js"
import {mixinInitiallyHidden} from "./component/mixin-initially-hidden.js"

export * from "lit-element"
export * from "lit-html"
export * from "@adobe/lit-mobx"
export * from "./component/mixin-styles.js"
export * from "./component/register-components.js"
export * from "./component/share.js"
export * from "./component/theme-components.js"

@mixinSubscribe
@mixinMobxAutorun
@mixinInitiallyHidden
export class Component extends MobxLitElement {}

export class WiredComponent<S extends Share> extends Component {
	readonly share: S
}

export function maybe<xContent>(condition: any, content: xContent): xContent {
	return condition
		? content
		: null
}
