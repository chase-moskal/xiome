
import xiomeStoreCustomerPortalCss from "./xiome-store-customer-portal.css.js"

import {makeStoreModel} from "../../models/store-model.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

@mixinStyles(xiomeStoreCustomerPortalCss)
export class XiomeStoreCustomerPortal extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #storeModel() {
		return this.share.storeModel
	}

	async init() {
		await this.#storeModel.initialize()
	}

	#openPopup = async () => {
		const {customerPortal} = this.#storeModel.billing
		await customerPortal()
	}

	#renderControls = () => {
		const state = this.#storeModel.snap.readable
		const {connectStatusOp} = state.stripeConnect
		return renderOp(connectStatusOp, status => {
			return status === StripeConnectStatus.Ready
				? html`
					<xio-button @press=${this.#openPopup}>
						open customer portal </xio-button>
				`
				: html`<slot name="not-ready"></slot>`
		})
	}

	render() {
		const {allowance} = this.#storeModel
		return html`
			<h3>Customer Portal</h3>
			${allowance.connectStripeAccount
				?	this.#renderControls()
				: html`<slot name="logged-out"></slot>`}
		`
	}
}
