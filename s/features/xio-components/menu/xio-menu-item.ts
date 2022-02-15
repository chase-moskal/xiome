
import xioMenuItemCss from "./styles/xio-menu-item.css.js"
import {getAssignedElements} from "./utils/get-assigned-elements.js"
import {Component, property, html, mixinStyles, mixinFocusable} from "../../../framework/component.js"

export class MenuPanelChangeEvent extends CustomEvent<{open: boolean}> {
	constructor(detail: {open: boolean}) {
		super("menuPanelChange", {detail, bubbles: true})
	}
}

@mixinStyles(xioMenuItemCss)
export class XioMenuItem extends Component {

	#hasPanel = false

	@property({type: String, reflect: true})
	theme = ""

	@property({type: Boolean, reflect: true})
	lefty = false

	@property({type: Boolean, reflect: true})
	open = false

	onMenuPanelChange: (event: MenuPanelChangeEvent) => void

	toggle(open = !this.open) {
		this.open = open
		const event = new MenuPanelChangeEvent({open})
		this.dispatchEvent(event)
		if (this.onMenuPanelChange)
			this.onMenuPanelChange(event)
	}

	updated(changedProperties: any) {
		const panelSlot = this.shadowRoot.querySelector<HTMLSlotElement>(`slot[name="panel"]`)
		const panelIsProvided = !!getAssignedElements(panelSlot).length
		if (this.#hasPanel !== panelIsProvided) {
			this.#hasPanel = panelIsProvided
			this.requestUpdate()
		}
	}

	#handleButtonClick = () => {
		if (this.#hasPanel) {
			this.toggle()
			this.shadowRoot.querySelector("button").focus()
		}
	}

	render() {
		return html`
			<button
				part=button
				tabindex=${this.#hasPanel ? 0 : -1}
				@click=${this.#handleButtonClick}>
					<slot part=buttoncontent></slot>
			</button>
			<slot name=panel part=panel></slot>
		`
	}
}
