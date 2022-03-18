
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

import {ops} from "../../../../framework/ops.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {Component, html, mixinRequireShare, mixinStyles, property, query} from "../../../../framework/component.js"

export class XiomeStoreConnect extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #storeModel() {
		return this.share.storeModel
	}

	async init() {
		await this.#storeModel.connectSubmodel.initialize()
	}

	private renderStripeConnectControls() {
		const {connectStatusOp} = this.#storeModel.state.stripeConnect
		const {connectDetailsOp} = this.#storeModel.state.stripeConnect
		const {connectStripeAccount, stripeLogin, pause, resume} = this.#storeModel.connectSubmodel
		return html`
			${renderOp(connectStatusOp, status => {
				switch (status) {
					case StripeConnectStatus.Unlinked: return html`
						<p>status: unlinked</p>
						<xio-button @press=${connectStripeAccount}>Connect Stripe</xio-button>
					`
					case StripeConnectStatus.Incomplete: return html`
						<p>status: incomplete</p>
						<xio-button @press=${stripeLogin}>Login to Stripe</xio-button>
					`
					case StripeConnectStatus.Paused: return html`
						<p>status: paused</p>
						<xio-button @press=${stripeLogin}>Login to Stripe</xio-button>
						<xio-button @press=${resume}>Resume Ecommerce</xio-button>
					`
					case StripeConnectStatus.Ready: {
						const details = ops.value(connectDetailsOp)
						return html`
							<p>status: ready</p>
							<p>details:</p>
							<ul>
								<li>charges enabled: ${details.charges_enabled ?"true" :"false"}</li>
								<li>details submitted: ${details.details_submitted ?"true" :"false"}</li>
								<li>payouts enabled: ${details.payouts_enabled ?"true" :"false"}</li>
								<li>email: ${details.email}</li>
								<li>paused: ${details.paused}</li>
								<li>stripe account id: ${details.stripeAccountId}</li>
								<li>time linked: ${details.timeLinked}</li>
							</ul>
							<xio-button @press=${stripeLogin}>Login to Stripe</xio-button>
							<xio-button @press=${pause}>Pause Ecommerce</xio-button>
						`
					}
				}
			})}
		`
	}

	render() {
		const {allowance} = this.#storeModel
		return html`
			<h3>Connect Stripe Account</h3>
			${allowance.connectStripeAccount
				? this.renderStripeConnectControls()
				: html`<p>your account is not allowed to control the linked stripe account</p>`}
		`
	}
}
