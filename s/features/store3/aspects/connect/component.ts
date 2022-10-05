
import {html} from "lit"

import {makeStoreModel} from "../../model.js"
import {ops} from "../../../../framework/ops.js"
import {StripeConnectStatus} from "../../isomorphic/concepts.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {mixinRequireShare, Component} from "../../../../framework/component.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

export class XiomeStoreConnect extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #storeModel() {
		return this.share.storeModel
	}

	async init() {
		await this.#storeModel.initialize()
	}

	private renderStripeConnectControls() {
		const state = this.#storeModel.snap.readable
		const {connectStatusOp} = state.stripeConnect
		const {connectDetailsOp} = state.stripeConnect
		const {connectStripeAccount, stripeLogin, pause, resume} = this.#storeModel.connect
		return renderOp(connectStatusOp, status => {
			switch (status) {
				case StripeConnectStatus.Unlinked: return html`
					<p>status: unlinked</p>
					<xio-button @press=${connectStripeAccount}>Connect Stripe</xio-button>
				`
				case StripeConnectStatus.Incomplete: return html`
					<p>status: incomplete</p>
					<xio-button @press=${stripeLogin}>Login to Stripe</xio-button>
					<xio-button @press=${connectStripeAccount}>CONNECT STRIPE ACCOUNT</xio-button>
				`
				case StripeConnectStatus.Paused: return html`
					<p>status: paused</p>
					<xio-button @press=${stripeLogin}>Login to Stripe</xio-button>
					<xio-button @press=${connectStripeAccount}>CONNECT STRIPE ACCOUNT</xio-button>
					<xio-button @press=${resume}>Resume Ecommerce</xio-button>
				`
				case StripeConnectStatus.Ready: {
					const details = ops.value(connectDetailsOp)
					return details
						? html`
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
						: html`
							<p>status: loading</p>
						`
				}
			}
		})
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
