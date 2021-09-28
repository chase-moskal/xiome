
import styles from "./xiome-video-link.css.js"
import {DacastLinkDisplay} from "../../types/dacast-link.js"
import {makeDacastModel} from "../../models/parts/dacast-model.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component/component.js"
import {videoPrivileges} from "../../api/video-privileges.js"

@mixinStyles(styles)
export class XiomeVideoLink extends ComponentWithShare<{
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
	}
	#handleLinkClick = async() => {
		this.#linkFailed = false
		const apiKey = this.#apiKeyDraft
		const link = await this.share.dacastModel.linkAccount({apiKey})
		this.#linkFailed = !link
	}
	#handleUnlinkClick = async() => {
		await this.share.dacastModel.unlinkAccount()
	}

	#renderWhenUnlinked = () => {
		return html`
			<h2>link your dacast account</h2>
			<div class=linkbox>
				<xio-text-input @valuechange=${this.#handleInputChange}>api key</xio-text-input>
				<xio-button @press=${this.#handleLinkClick}>link</xio-button>
			</div>
			${this.#linkFailed
				? html`<p class=failed>dacast rejected the api link</p>`
				: null}
			<div class=helpbox>
				<p>how to find your dacast api key</p>
				<ul>
					<li>create a <a target=_blank href="https://dacast.com/">dacast</a> account</li>
					<li>if you have a trial account, you must email support and ask them to activate your account's "api access"</li>
					<li>generate an api key in your <a target=_blank href="https://app.dacast.com/settings/integrations">dacast integrations settings</a></li>
				</ul>
			</div>
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
					: html`<p>you don't have permission to link video accounts</p>`}
			</div>
		`)
	}
}
