
import {CSSResult, CSSResultArray, LitElement} from "lit-element"
import {Track} from "../../toolbox/autowatcher/types/watcher-types.js"
import {Autowatcher} from "../../toolbox/autowatcher/types/autowatcher.js"

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
	CustomElement
		{}

export type CSS = CSSResult | CSSResultArray | CSSStyleSheet

export interface LitBaseClass {
	new(...args: any[]): LitBase
	styles?: CSS
}

export interface AutowatchComponent extends LitBase {
	auto: Autowatcher
	autotracks: Track[]
}
