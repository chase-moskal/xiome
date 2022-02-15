
import xioMenuItemCss from "./styles/xio-menu-item.css.js"
import {getAssignedElements} from "./utils/get-assigned-elements.js"
import {Component, property, html, mixinStyles} from "../../../framework/component.js"

export class MenuPanelChangeEvent extends CustomEvent<{open: boolean}> {
	constructor(detail: {open: boolean}) {
		super("menupanelchange", {detail, bubbles: true})
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

	onmenupanelchange: (event: MenuPanelChangeEvent) => void

	toggle(open = !this.open) {
		this.open = open
		const event = new MenuPanelChangeEvent({open})
		this.dispatchEvent(event)
		if (this.onmenupanelchange)
			this.onmenupanelchange(event)
	}

	updated(changedProperties: any) {
		const panelSlot = this.shadowRoot.querySelector<HTMLSlotElement>(`slot[name="panel"]`)
		const panelIsProvided = !!getAssignedElements(panelSlot).length
		this.#hasPanel = panelIsProvided

		if (changedProperties.has("open") && this.open)
			this.shadowRoot.querySelector("button").focus()
	}

	#handleButtonClick = () => {
		if (this.#hasPanel)
			this.toggle()
	}

	render() {
		return html`
			<button part=button @click=${this.#handleButtonClick}>
				<slot></slot>
			</button>
			<slot name=panel part=panel></slot>
		`
	}
}
