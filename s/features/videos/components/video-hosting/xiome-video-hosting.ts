
import {DacastLinkDisplay} from "../../types/dacast-link.js"
import {videoPrivileges} from "../../api/video-privileges.js"
import {makeDacastModel} from "../../models/parts/dacast-model.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {validateDacastApiKeyAllowingMock} from "../../api/validation/validate-dacast-api-key.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"

import styles from "./xiome-video-hosting.css.js"

@mixinStyles(styles)
export class XiomeVideoHosting extends ComponentWithShare<{
		dacastModel: ReturnType<typeof makeDacastModel>
	}> {

	get state() {
		return this.share.dacastModel.state
	}

	async init() {
		await this.share.dacastModel.initialize()
	}

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

	#showHelp = () => {
		return html`
			<div class=helpbox>
				<p>how to find your dacast api key</p>
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
			<div class=linkbox>
				<xio-text-input
					placeholder="api key"
					.validator=${validateDacastApiKeyAllowingMock}
					@enterpress=${this.#handleLinkClick}
					@valuechange=${this.#handleInputChange}>
				</xio-text-input>
				<xio-button
					class=helpBtn
					@press=${() => this.#showHelp}>
						help
				</xio-button>
				<xio-button
					class=linkBtn
					?disabled=${!this.#apiKeyDraft}
					@press=${this.#handleLinkClick}>
						link
				</xio-button>
			</div>
			${this.#linkFailed
				? html`<p class=failed>dacast rejected the api link</p>`
				: null}
		`
	}

	#renderWhenLinked = (linkedAccount: DacastLinkDisplay) => {
		return html`
			<h2>your dacast account is linked</h2>
			<p>linked on ${formatDate(linkedAccount.time).full}</p>
			<xio-button @press=${this.#handleUnlinkClick}>unlink</xio-button>
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
