
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeBillingCss from "./xiome-billing.css.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"

@mixinStyles(xiomeBillingCss)
export class XiomeBilling extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	render() {
		const {state, billingSubmodel} = this.share.storeModel
		return html`
			<slot><h3>billing</h3></slot>
			${renderOp(state.billing.paymentMethodOp, method => method ?html`
				<p>linked credit card</p>
				<p>card type: ${method.cardClues.brand}</p>
				<p>country: ${method.cardClues.country}</p>
				<p>
					expires:
					${method.cardClues.expireMonth}/${method.cardClues.expireYear}
				</p>
				<p>last 4 digits: ${method.cardClues.last4}</p>
				<div class=buttons>
					<xio-button @click=${billingSubmodel.disconnectPaymentMethod}>
						unlink card
					</xio-button>
					<xio-button @click=${billingSubmodel.checkoutPaymentMethod}>
						update card
					</xio-button>
				</div>
			`: html`
				<p>no credit card linked</p>
				<div class=buttons>
					<xio-button @click=${billingSubmodel.checkoutPaymentMethod}>
						link credit card
					</xio-button>
				</div>
			`)}
		`
	}
}
