
import {DacastLinkDisplay} from "../../types/dacast-link.js"
import {videoPrivileges} from "../../api/video-privileges.js"
import clockIcon from "../../../../framework/icons/clock.svg.js"
import {makeDacastModel} from "../../models/parts/dacast-model.js"
import warningIcon from "../../../../framework/icons/warning.svg.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {validateDacastApiKeyAllowingMock} from "../../api/validation/validate-dacast-api-key.js"
import {Component, mixinStyles, html, mixinRequireShare} from "../../../../framework/component.js"

import styles from "./xiome-video-hosting.css.js"

@mixinStyles(styles)
export class XiomeVideoHosting extends mixinRequireShare<{
		dacastModel: ReturnType<typeof makeDacastModel>
	}>()(Component) {

	get state() {
		return this.share.dacastModel.state
	}

	async init() {
		await this.share.dacastModel.initialize()
	}

	#showHelp = false
	#linkFailed = false
	#apiKeyDraft = ""
	#handleInputChange = ({detail: {value}}: ValueChangeEvent<string>) => {
		this.#apiKeyDraft = value
		this.requestUpdate()
	}
	#handleLinkClick = async() => {
		const apiKey = this.#apiKeyDraft
		if (apiKey) {
			this.#linkFailed = false
			this.#apiKeyDraft = ""
			const link = await this.share.dacastModel.linkAccount({apiKey})
			this.#linkFailed = !link
		}
	}
	#handleUnlinkClick = async() => {
		this.#apiKeyDraft = ""
		await this.share.dacastModel.unlinkAccount()
	}

	#toggleHelp = () => {
		this.#showHelp = !this.#showHelp
		this.requestUpdate()
	}

	#renderHelp = () => {
		return html`
			<div class=helpbox>
				<p>how to find your dacast api key:</p>
				<ul>
					<li>create a <a part=link target=_blank href="https://dacast.com/">dacast</a> account</li>
					<li>if you have a trial account, you must email support and ask them to activate your account's "api access"</li>
					<li>generate an api key in your <a part=link target=_blank href="https://app.dacast.com/settings/integrations">dacast integrations settings</a></li>
				</ul>
			</div>
		`
	}

	#renderWhenUnlinked = () => {
		return html`
			<h2>link your dacast account</h2>
			<xio-text-input
				placeholder="api key"
				.validator=${validateDacastApiKeyAllowingMock}
				@enterpress=${this.#handleLinkClick}
				@valuechange=${this.#handleInputChange}>
			</xio-text-input>
			${this.#linkFailed
				? html`<div class=failed>${warningIcon} <p>dacast rejected the api link</p></div>`
				: null}
			<div class=buttonbar>
				<xio-button
					class=help-button
					@press=${this.#toggleHelp}>
						${this.#showHelp
							? "hide help"
							: "show help"}
				</xio-button>
				<xio-button
					class=link-button
					?disabled=${!this.#apiKeyDraft}
					@press=${this.#handleLinkClick}>
						link
				</xio-button>
			</div>
			${this.#showHelp
				? this.#renderHelp()
				: null}
		`
	}

	#renderWhenLinked = (linkedAccount: DacastLinkDisplay) => {
		return html`
			<h2>your dacast account is linked</h2>
			<div class=link-time-info>
				${clockIcon}
				<p>linked on ${formatDate(linkedAccount.time).full}</p>
			</div>
			<div class=unlink-button>
				<xio-button @press=${this.#handleUnlinkClick}>unlink</xio-button>
			</div>
		`
	}

	render() {
		return renderOp(this.state.accessOp, access => html`
			<div class=dacastbox>
				${access.permit.privileges.includes(videoPrivileges["moderate videos"])
					? renderOp(this.state.linkedAccountOp, linkedAccount =>
						linkedAccount
							? this.#renderWhenLinked(linkedAccount)
							: this.#renderWhenUnlinked()
					)
					: html`<slot name=forbidden>you don't have permission to edit video hosting settings</slot>`}
			</div>
		`)
	}
}
