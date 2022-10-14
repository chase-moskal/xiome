
import {makeStoreModel} from "../../model/model.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"
import {ops} from "../../../../../framework/ops.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeStoreBillingArea extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #state() {
		return this.share.storeModel.snap.readable
	}

	get #paymentMethod() {
		return ops.value(this.#state.billing.paymentMethodOp)
	}

	render() {
		const paymentMethodOp = this.#state.billing.paymentMethodOp
		const card = this.#paymentMethod?.cardClues
		return renderOp(paymentMethodOp, () => {
			return html`
				<div class="billing_area">
					${card ? html`
							<div>
								<p>Payment Method</p>
								${card.brand} ${card.last4}
							</div>
						`
						: null}
					<xiome-store-customer-portal>
						<span slot="button-label">Billing Portal</span>
					</xiome-store-customer-portal>
				</div>
			`
		})
	}
	}
