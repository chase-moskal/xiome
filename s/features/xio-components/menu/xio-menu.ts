
import {snapstate} from "@chasemoskal/snapstate"

import {getAssignedElements} from "./utils/get-assigned-elements.js"
import {MenuPanelChangeEvent, XioMenuItem} from "./xio-menu-item.js"
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
		if (!this.active)
			this.#snap.state.scrollTop = this.sticky
				? window.scrollY
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
		this.#scrollListener()
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

	getMenuItems() {
		const slot = this.shadowRoot.querySelector("slot")
		return getAssignedElements<XioMenuItem>(slot)
			.filter(element => element instanceof XioMenuItem)
	}

	updated() {
		for (const item of this.getMenuItems())
			item.theme = this.theme
	}

	#handleBlanketClick = () => {
		const items = this.getMenuItems()
		for (const item of items)
			item.toggle(false)
	}

	#handleMenuPanelChange = ({detail}: MenuPanelChangeEvent) => {
		const menuItems = this.getMenuItems()

		const openMenuItem = menuItems.find(item => item.open)
		this.active = !!openMenuItem

		// coordinate menu panel mutual-exclusivity,
		// only one panel can be open at a time
		if (detail.open) {
			const otherMenuItems = menuItems.filter(item => item !== openMenuItem)
			for (const item of otherMenuItems) {
				if (item.open)
					item.toggle(false)
			}
		}
	}

	render() {
		const {scrollTop, activeIndex} = this.#snap.state
		return html`
			<div class=system data-active-index=${activeIndex} style="${`top: ${scrollTop}px`}">
				<div part=blanket @click=${this.#handleBlanketClick}></div>
				<div part=list @menuPanelChange=${this.#handleMenuPanelChange}>
					<slot></slot>
				</div>
			</div>
		`
	}
}
