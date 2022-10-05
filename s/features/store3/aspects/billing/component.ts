
import {html} from "lit"
import {makeStoreModel} from "../../model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import xiomeBillingCss from "../../../store2/components/billing/xiome-billing.css.js"
import {mixinStyles, mixinRequireShare, Component} from "../../../../framework/component.js"

@mixinStyles(xiomeBillingCss)
export class XiomeBilling extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	render() {
		const {snap, billing} = this.share.storeModel
		const state = snap.readable
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
					<xio-button @click=${billing.disconnectPaymentMethod}>
						unlink card
					</xio-button>
					<xio-button @click=${billing.checkoutPaymentMethod}>
						update card
					</xio-button>
				</div>
			`: html`
				<p>no credit card linked</p>
				<div class=buttons>
					<xio-button @click=${billing.checkoutPaymentMethod}>
						link credit card
					</xio-button>
				</div>
			`)}
		`
	}
}
