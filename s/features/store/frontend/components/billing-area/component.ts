
import {ops} from "../../../../../framework/ops.js"
import {makeStoreModel} from "../../model/model.js"
import {StripeConnectStatus} from "../../../isomorphic/concepts.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"

@mixinStyles(styles)
export class XiomeStoreBillingArea extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	async init() {
		await this.share.storeModel.initialize()
	}

	get #state() {
		return this.share.storeModel.snap.readable
	}

	get #paymentMethod() {
		return ops.value(this.#state.billing.paymentMethodOp)
	}

	render() {
		const {paymentMethodOp} = this.#state.billing
		const {connectStatusOp} = this.#state.stripeConnect
		const connectStatus = ops.value(connectStatusOp)
		const card = this.#paymentMethod?.cardClues

		return renderOp(ops.combine(paymentMethodOp, connectStatusOp), () => {
			return connectStatus !== StripeConnectStatus.Ready
				? null
				: html`
					<div class="billing_area">
						<xiome-store-customer-portal>
							<slot>billing settings</slot>
						</xiome-store-customer-portal>
						${card
							? html`
								<div>
									<p>Payment Method</p>
									${card.brand} ${card.last4}
								</div>
							`
							: null}
					</div>
				`
		})
	}
	}
