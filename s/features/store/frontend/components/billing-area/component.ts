
import {makeStoreModel} from "../../model/model.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"
import {ops} from "../../../../../framework/ops.js"

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
		return html`
			<xiome-store-customer-portal>
				<span slot="button-label">Billing Portal</span>
			</xiome-store-customer-portal>
		`
	}
	}
