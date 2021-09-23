
import styles from "./xiome-video-link.css.js"
import {DacastLinkDisplay} from "../../types/dacast-link.js"
import {makeDacastModel} from "../../models/parts/dacast-model.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeVideoLink extends ComponentWithShare<{
		dacastModel: ReturnType<typeof makeDacastModel>
	}> {

	get state() {
		return this.share.dacastModel.state
	}

	async init() {
		await this.share.dacastModel.loadLinkedAccount()
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
			<h2>Link your Dacast account</h2>
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
					<li>
				</ul>
			</div>
		`
	}

	#renderWhenLinked = (linkedAccount: DacastLinkDisplay) => {
		return html`
			<h2>Your Dacast account is linked</h2>
			<p>linked on ${formatDate(linkedAccount.time).full}</p>
			<xio-button @press=${this.#handleUnlinkClick}>unlink</xio-button>
		`
	}

	render() {
		return renderOp(this.state.accessOp, access => html`
			<div class=dacastbox>
				${renderOp(this.state.linkedAccountOp, linkedAccount =>
					linkedAccount
						? this.#renderWhenLinked(linkedAccount)
						: this.#renderWhenUnlinked()
				)}
			</div>
		`)
	}
}
