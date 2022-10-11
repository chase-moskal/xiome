
import {makeStoreModel} from "../../model/model.js"
import {ops} from "../../../../../framework/ops.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../../framework/component.js"

import styles from "./styles.js"

@mixinStyles(styles)
export class XiomeStoreSubscriptionControls extends mixinRequireShare<{
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #state() {
		return this.share.storeModel.snap.readable
	}

	get #subSubscribedPlans() {
		const subscriptions = ops.
			value(this.#state.subscriptions.mySubscriptionDetailsOp)
		const planIds = subscriptions?.map(plan => plan.planId)
		return planIds?.join(" ")
	}

	render() {
		const plansIds = this.#subSubscribedPlans
		return html`
			<div>
				<h3>My Subscriptions</h3>

				<xiome-store-subscription-catalog
					allow-plans=${plansIds}
				></xiome-store-subscription-catalog>
				<br/>
				<br/>

				<xiome-store-customer-portal>
					<span slot="button-label">Manage Payments</span>
				</xiome-store-customer-portal>
			</div>
		`
	}
}
