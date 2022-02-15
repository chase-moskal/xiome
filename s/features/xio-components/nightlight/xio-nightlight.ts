
import {NightlightChangeHandler} from "./details/nightlight-types.js"
import {NightlightChangeEvent} from "./details/nightlight-change-event.js"
import {Component, property, html, mixinStyles} from "../../../framework/component.js"
import {nightlightSettingStorage} from "./details/nightlight-setting-storage.js"

import xioThemerCss from "./xio-nightlight.css.js"
import sunSvg from "../../../framework/icons/feather/sun.svg.js"
import moonSvg from "../../../framework/icons/feather/moon.svg.js"

const nightlightDataAttributeName = "data-nightlight"

/*

nightlight is a toggle button for dark theme.

in "night" mode, the "data-nightlight" attribute is set on the source element.

	<body data-nightlight>

if you want to start your website in night mode by default,
just start your source element with the "data-nightlight" attribute.

*/

@mixinStyles(xioThemerCss)
export class XioNightlight extends Component {
	static readonly NightlightChangeEvent = NightlightChangeEvent

	@property({type: Boolean, reflect: true})
	["show-destination-state"] = false

	@property({type: String, reflect: true})
	["title-to-night"] = "turn down the lights"

	@property({type: String, reflect: true})
	["title-to-day"] = "turn up the lights"

	sourceElement: HTMLElement = document.documentElement

	#storage = nightlightSettingStorage()

	#setNightOnSourceElement(night: boolean) {
		if (night)
			this.sourceElement.setAttribute(nightlightDataAttributeName, "")
		else
			this.sourceElement.removeAttribute(nightlightDataAttributeName)
	}

	firstUpdated() {
		const settings = this.#storage.load()

		if (settings)
			this.night = settings.night

		window.addEventListener("nightlightChange", event => {
			if (event.target !== this)
				this.requestUpdate()
		})
	}

	get night() {
		return this.sourceElement.getAttribute(nightlightDataAttributeName) !== null
	}

	set night(value: boolean) {
		this.#storage.save({night: value})
		const previous = this.night
		if (value !== previous) {
			this.#setNightOnSourceElement(value)
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
		const {night} = this
		const showNight = this["show-destination-state"]
			? !night
			: night
		return html`
			<button
				part=button
				title="${night ? this["title-to-day"] : this["title-to-night"]}"
				?data-nightlight=${night}
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
