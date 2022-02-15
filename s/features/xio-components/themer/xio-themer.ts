
import {ThemeChangeHandler} from "./details/themer-types.js"
import {ThemeChangeEvent} from "./details/theme-change-event.js"
import {Component, html, mixinStyles} from "../../../framework/component.js"

import xioThemerCss from "./xio-themer.css.js"
import sunSvg from "../../../framework/icons/feather/sun.svg.js"
import moonSvg from "../../../framework/icons/feather/moon.svg.js"

@mixinStyles(xioThemerCss)
export class XioThemer extends Component {
	static readonly ThemeChangeEvent = ThemeChangeEvent

	#dark: boolean = false

	get dark() {
		return this.#dark
	}

	onthemechange: ThemeChangeHandler

	#dispatchChange() {
		const event = new ThemeChangeEvent({dark: this.#dark})
		this.dispatchEvent(event)
		if (this.onthemechange)
			this.onthemechange(event)
	}

	toggle(dark: boolean = !this.#dark) {
		this.#dark = dark

		if (dark)
			this.setAttribute("dark", "")
		else
			this.removeAttribute("dark")

		this.requestUpdate()
		this.#dispatchChange()
	}

	render() {
		return html`
			<button part=button @click=${() => this.toggle()}>
				${this.#dark
					? html`
						<slot name=dark>
							${moonSvg}
						</slot>
					`
					: html`
						<slot name=light>
							${sunSvg}
						</slot>
					`}
			</button>
		`
	}
}
