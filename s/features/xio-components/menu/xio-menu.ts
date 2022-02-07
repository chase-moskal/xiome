
import {snapstate} from "@chasemoskal/snapstate"

import {XioMenuItem} from "./xio-menu-item.js"
import {getAssignedElements} from "./utils/get-assigned-elements.js"
import {Component, property, html, mixinStyles} from "../../../framework/component.js"

import xioMenuCss from "./styles/xio-menu.css.js"

@mixinStyles(xioMenuCss)
export class XioMenu extends Component {

	@property({type: String, reflect: true})
	theme = "concrete"

	@property({type: Boolean, reflect: true})
	active = false

	@property({type: Boolean, reflect: true})
	sticky = false

	@property({type: Boolean, reflect: true})
	lefty = false

	#snap = snapstate({
		activeIndex: undefined as undefined | number,
		scrollTop: 0,
	})

	#untrack = () => {}

	#scrollEvents = ["scroll", "resize"]

	#scrollListener = () => {
		this.#snap.state.scrollTop = this.sticky
			? document.body.scrollTop
				?? document.documentElement.scrollTop
				?? window.pageYOffset
				?? 0
			: 0
	}

	createRenderRoot() {
		const shadowRoot = super.createRenderRoot()
		shadowRoot.addEventListener("slotchange", () => this.requestUpdate())
		return shadowRoot
	}

	connectedCallback() {
		super.connectedCallback()
		this.#untrack = this.#snap.track(
			() => this.render(),
			() => this.requestUpdate(),
		)
		for (const event of this.#scrollEvents)
			window.addEventListener(event, this.#scrollListener)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#untrack()
		this.#untrack = () => {}
		for (const event of this.#scrollEvents)
			window.removeEventListener(event, this.#scrollListener)
	}

	toggleItem(index: number) {
		this.#snap.state.activeIndex = index === this.#snap.state.activeIndex
			? undefined
			: index
		this.active = this.#snap.state.activeIndex !== undefined
	}

	getMenuItems() {
		const slot = this.shadowRoot.querySelector("slot")
		return getAssignedElements<XioMenuItem>(slot)
			.filter(element => element instanceof XioMenuItem)
	}

	updated() {
		const items = this.getMenuItems()
		items.forEach((item, index) => {
			item.theme = this.theme
			item.lefty = this.lefty
			item.toggle = () => this.toggleItem(index)
			item.open = index === this.#snap.state.activeIndex
		})
	}

	#handleBlanketClick = () => {
		this.toggleItem(this.#snap.state.activeIndex)
	}

	render() {
		const {scrollTop} = this.#snap.state
		return html`
			<div class=system style="${`top: ${scrollTop}px`}">
				<div class=blanket @click=${this.#handleBlanketClick}></div>
				<div class=list>
					<slot></slot>
				</div>
			</div>
		`
	}
}
