
import {NightlightChangeHandler} from "./details/nightlight-types.js"
import {NightlightChangeEvent} from "./details/nightlight-change-event.js"
import {Component, property, html, mixinStyles} from "../../../framework/component.js"

import xioThemerCss from "./xio-nightlight.css.js"
import sunSvg from "../../../framework/icons/feather/sun.svg.js"
import moonSvg from "../../../framework/icons/feather/moon.svg.js"

@mixinStyles(xioThemerCss)
export class XioNightlight extends Component {
	static readonly NightlightChangeEvent = NightlightChangeEvent

	@property({type: Boolean, reflect: true})
	["show-destination-state"] = false

	sourceElement: HTMLElement = document.body

	firstUpdated() {
		window.addEventListener("nightlightChange", event => {
			if (event.target !== this)
				this.requestUpdate()
		})
	}

	get night() {
		return this.sourceElement.getAttribute("data-nightlight") !== null
	}

	set night(value: boolean) {
		const previous = this.night
		if (value !== previous) {
			if (value)
				this.sourceElement.setAttribute("data-nightlight", "")
			else
				this.sourceElement.removeAttribute("data-nightlight")

			this.requestUpdate()
			this.#dispatchChange()
		}
	}

	onNightlightChange: NightlightChangeHandler

	#dispatchChange() {
		const event = new NightlightChangeEvent({night: this.night})
		this.dispatchEvent(event)
		if (this.onNightlightChange)
			this.onNightlightChange(event)
	}

	toggle(night: boolean = !this.night) {
		this.night = night
	}

	render() {
		const showNight = this["show-destination-state"]
			? !this.night
			: this.night
		return html`
			<button
				?data-nightlight=${this.night}
				part=button
				@click=${() => this.toggle()}>
					${showNight
						? html`
							<slot name=night>
								${moonSvg}
							</slot>
						`
						: html`
							<slot name=day>
								${sunSvg}
							</slot>
						`}
			</button>
		`
	}
}
