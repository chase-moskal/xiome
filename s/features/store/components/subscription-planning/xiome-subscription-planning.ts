
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

import {select} from "../../../../toolbox/select/select.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {Component, html, mixinRequireShare, mixinStyles, property, query} from "../../../../framework/component.js"

interface PlanDraft {
	planLabel: string
	tierLabel: string
	tierPrice: number
}

function priceInCents(value: string) {
	const n = parseFloat(value)
	return Math.round(n * 100)
}

export class XiomeSubscriptionPlanning extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	get #storeModel() {
		return this.share.storeModel
	}

	@property()
	private isPlanDraftPanelOpen: boolean = false

	#togglePlanDraftPanel = () => {
		this.isPlanDraftPanelOpen = !this.isPlanDraftPanelOpen
	}

	async init() {
		await this.#storeModel.subscriptionsSubmodel.initialize()
	}

	#submitNewPlan = async() => {
		const elements = {
			planlabel: select<XioTextInput>(`xio-text-input[data-field="planlabel"]`, this.shadowRoot),
			tierlabel: select<XioTextInput>(`xio-text-input[data-field="tierlabel"]`, this.shadowRoot),
			tierprice: select<XioTextInput>(`xio-text-input[data-field="tierprice"]`, this.shadowRoot),
		}
		const draft: PlanDraft = {
			planLabel: elements.planlabel.value,
			tierLabel: elements.tierlabel.value,
			tierPrice: priceInCents(elements.tierprice.value),
		}
		console.log("draft:", draft)
		await this.#storeModel.subscriptionsSubmodel.addPlan(draft)
	}

	#renderPlanDraftPanel() {
		return html`
			<div class=plandraft>
				<xio-text-input data-field=planlabel>plan label</xio-text-input>
				<xio-text-input data-field=tierlabel>tier label</xio-text-input>
				<xio-text-input data-field=tierprice>tier price</xio-text-input>
				<xio-button @click=${this.#submitNewPlan}>submit</xio-button>
			</div>
		`
	}

	#renderPlanning() {
		const {subscriptionPlansOp} = this.#storeModel.state.subscriptions
		return renderOp(subscriptionPlansOp, plans => html`
			<ul>
				${plans.map(plan => html`
					<li>
						<p>label: ${plan.label}</p>
						<p>plan id: ${plan.planId}</p>
						<p>role id: ${plan.roleId}</p>
						<p>time created: ${plan.time}</p>
						<p>tiers:</p>
						<ul>
							${plan.tiers.map(tier => html`
								<li>
									<p>tier label${tier.label}</p>
									<p>tier id: ${tier.tierId}</p>
									<p>role id: ${tier.roleId}</p>
									<p>price: ${tier.price}</p>
									<p>time created: ${tier.time}</p>
									<p>active: ${tier.active ?"true" :"false"}</p>
								</li>
							`)}
						</ul>
					</li>
				`)}
			</ul>
			<xio-button @click=${this.#togglePlanDraftPanel}>
				+ Add Plan
			</xio-button>
			${this.isPlanDraftPanelOpen
				? this.#renderPlanDraftPanel()
				: null}
		`)
	}

	render() {
		const {allowance} = this.#storeModel
		return html`
			<h3>Subscription Planning</h3>
			${allowance.manageStore
				? this.#renderPlanning()
				: html`<p>your account does not have permissions to manage the store</p>`}
		`
	}
}
