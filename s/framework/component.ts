
import {MobxLitElement} from "@adobe/lit-mobx"

import {Share} from "./share.js"
import {mixinMobxAutorun} from "./mixin-mobx-autorun.js"
import {mixinInitiallyHidden} from "./mixin-initially-hidden.js"

export * from "lit-element"
export * from "@adobe/lit-mobx"
export * from "./mixin-initially-hidden.js"
export * from "./mixin-mobx-autorun.js"
export * from "./mixin-styles.js"
export * from "./mobb.js"
export * from "./register-components.js"
export * from "./share.js"
export * from "./theme-components.js"

@mixinMobxAutorun
@mixinInitiallyHidden
export class Component extends MobxLitElement {}

export class WiredComponent<S extends Share> extends Component {
	readonly share: S
}
