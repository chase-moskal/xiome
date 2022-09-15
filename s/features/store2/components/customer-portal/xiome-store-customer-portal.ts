
import xiomeStoreCustomerPortalCss from "./xiome-store-customer-portal.css.js"

import {makeStoreModel} from "../../models/store-model.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"
import {ops} from "../../../../framework/ops.js"

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
		const {connectStatusOp} = this.#storeModel.state.stripeConnect
		return renderOp(connectStatusOp, status => {
			return status === StripeConnectStatus.Ready
				? html`
					<xio-button @press=${this.#openPopup}>
						open customer portal </xio-button>
				`
				: html`<slot name="not-ready">
						the merchant's stripe account must be ready, to access the customer portal
						</slot>
					`
		})
	}

	#renderButton() {
		return html`
			<xio-button @press=${this.#openPopup}>
				open customer portal
			</xio-button>
		`
	}

	#renderMessageWhenStoreInactive() {
		return html`
			<slot name="not-ready">
				the merchant's stripe account must be ready, to access the customer portal
			</slot>
		`
	}

	#renderMessageWhenLoggedOut() {
		return html`
			<slot name="logged-out">
				you must be logged in to access the customer portal.
			</slot>
		`
	}

	render() {
		const {accessOp} = this.#storeModel.state.user
		const {connectStatusOp} = this.#storeModel.state.stripeConnect
		const combinedOp = ops.combine(accessOp, connectStatusOp)
		return html`
			<h3>Customer Portal</h3>
			${renderOp(combinedOp, () => {
				const {userLoggedIn, storeActive} = this.#storeModel.get.is
				if (userLoggedIn) {
					if (storeActive) return this.#renderButton()
					else return this.#renderMessageWhenStoreInactive()
				}
				else return this.#renderMessageWhenLoggedOut()
			})}
		`
	}
}
