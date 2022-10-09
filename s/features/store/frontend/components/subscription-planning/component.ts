
import {html} from "lit"

import {planningUi} from "./ui/planning-ui.js"
import {makeStoreModel} from "../../model/model.js"
import {ops} from "../../../../../framework/ops.js"
import {StripeConnectStatus} from "../../../isomorphic/concepts.js"
import {makePlanningComponentSnap} from "./ui/planning-component-snap.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"
import {mixinStyles, mixinRequireShare, Component} from "../../../../../framework/component.js"

import styles from "./styles.js"

@mixinStyles(styles)
export class XiomeStoreSubscriptionPlanning extends mixinRequireShare<{
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
		this.addSubscription(
			() => this
				.#componentSnap
				.subscribe(() => this.requestUpdate())
		)
		await this
			.#storeModel
			.initialize()
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
