
import {CSSResult, CSSResultArray, LitElement, PropertyValues} from "../component.js"
import {Autowatcher, Track} from "../../../toolbox/autowatcher/types/autowatcher-types.js"

export type Constructor<T extends {}> = new(...args: any[]) => T

export interface CustomElement extends HTMLElement {
	observedAttributes?: string[]
	connectedCallback?(): void
	disconnectedCallback?(): void
	attributeChangedCallback?(
		attributeName: string,
		oldValue: string,
		newValue: string
	): void
}

export interface LitBase extends
		Pick<LitElement, "requestUpdate">,
		CustomElement {
	render?(): ReturnType<LitElement["render"]>
	firstUpdated?(...p: Parameters<LitElement["firstUpdated"]>): ReturnType<LitElement["firstUpdated"]>
}

export interface ComponentBaseWithShare<xShare> extends LitBase {
	readonly share: xShare
	init(): void
}

export type CSS = CSSResult | CSSResultArray | CSSStyleSheet

export interface LitBaseClass {
	new(...args: any[]): LitBase
	styles?: CSS
}

export interface AutowatchComponent extends LitBase {
	auto: Autowatcher
	firstUpdated(changes: PropertyValues): void
	subscribeAutotrack(track: Track<any>): void
	dispose(): void
}
