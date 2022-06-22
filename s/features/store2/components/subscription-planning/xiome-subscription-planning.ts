
import {planningUi} from "./ui/planning-ui.js"
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {makePlanningComponentSnap} from "./ui/planning-component-snap.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare, mixinStyles} from "../../../../framework/component.js"

import xiomeSubscriptionPlanningCss from "./xiome-subscription-planning.css.js"

@mixinStyles(xiomeSubscriptionPlanningCss)
export class XiomeSubscriptionPlanning extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	#componentSnap = makePlanningComponentSnap()
	get #storeModel() { return this.share.storeModel }

	#planningUi = planningUi({
		storeModel: this.#storeModel,
		componentSnap: this.#componentSnap,
		getShadowRoot: () => this.shadowRoot,
	})

	async init() {
		this.addSubscription(() =>
			this.#componentSnap.subscribe(() => this.requestUpdate()))
		await this.#storeModel.initialize()
	}

	render() {
		const {snap, allowance} = this.#storeModel
		const state = snap.readable
		const connectStatus = ops.value(state.stripeConnect.connectStatusOp)
		return html`
			${connectStatus === StripeConnectStatus.Ready
				? allowance.manageStore
					? this.#planningUi.renderPlanning()
					: html`<p>your account does not have permissions to manage the store</p>`
				: html`<p>store is not active</p>`}
		`
	}
}
