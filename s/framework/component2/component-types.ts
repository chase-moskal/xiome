
import {LitElement} from "lit-element"

export type Constructor<T extends {}> = new(...args: any[]) => T

export interface LitBase extends Pick<LitElement, "requestUpdate"> {
	connectedCallback(): void
	disconnectedCallback(): void
}
