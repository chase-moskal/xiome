
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

import {select} from "../../../../toolbox/select/select.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {Component, html, mixinRequireShare, mixinStyles, property, query} from "../../../../framework/component.js"
import {SubscriptionPlanDraft, SubscriptionTierDraft} from "./types/planning-types.js"
import {validateLabel, validatePriceString} from "../../api/services/validators/planning-validators.js"
import {ops} from "../../../../framework/ops.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"

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

	@property()
	private whichTierDraftPanelIsOpen: undefined | number = undefined

	#togglePlanDraftPanel = () => {
		this.isPlanDraftPanelOpen = !this.isPlanDraftPanelOpen
	}

	async init() {
		await this.#storeModel.initialize()
	}

	#submitNewPlan = async() => {
		const elements = {
			planlabel: select<XioTextInput>(
				`.plandraft xio-text-input[data-field="planlabel"]`,
				this.shadowRoot
			),
			tierlabel: select<XioTextInput>(
				`.plandraft xio-text-input[data-field="tierlabel"]`,
				this.shadowRoot
			),
			tierprice: select<XioTextInput>(
				`.plandraft xio-text-input[data-field="tierprice"]`,
				this.shadowRoot
			),
		}
		const draft: SubscriptionPlanDraft = {
			planLabel: elements.planlabel.value,
			tierLabel: elements.tierlabel.value,
			tierPrice: priceInCents(elements.tierprice.value),
		}
		await this.#storeModel.subscriptionsSubmodel.addPlan(draft)
		elements.planlabel.text = ""
		elements.tierlabel.text = ""
		elements.tierprice.text = ""
	}

	#submitNewTier = (planId: string) => async() => {
		const elements = {
			tierlabel: select<XioTextInput>(
				`.tierdraft xio-text-input[data-field="tierlabel"]`,
				this.shadowRoot
			),
			tierprice: select<XioTextInput>(
				`.tierdraft xio-text-input[data-field="tierprice"]`,
				this.shadowRoot
			),
		}
		await this.#storeModel.subscriptionsSubmodel.addTier({
			planId,
			label: elements.tierlabel.value,
			price: priceInCents(elements.tierprice.value),
			currency: "usd",
			interval: "month",
		})
	}

	#renderPlanDraftPanel() {
		return html`
			<div class=plandraft>
				<xio-text-input
					data-field=planlabel
					.validator=${validateLabel}>
						plan label</xio-text-input>
				<xio-text-input
					data-field=tierlabel
					.validator=${validateLabel}>
						tier label</xio-text-input>
				<xio-text-input
					data-field=tierprice
					.validator=${validatePriceString}>
						tier price</xio-text-input>
				<xio-button @click=${this.#submitNewPlan}>submit</xio-button>
			</div>
		`
	}

	#renderTierDraftPanel(planId: string) {
		return html`
			<div class=tierdraft>
				<xio-text-input
					data-field=tierlabel
					.validator=${validateLabel}>
						tier label</xio-text-input>
				<xio-text-input
					data-field=tierprice
					.validator=${validatePriceString}>
						tier price</xio-text-input>
			</div>
			<xio-button @click=${this.#submitNewTier(planId)}>
				Submit new tier
			</xio-button>
		`
	}

	#renderPlanning() {
		const {subscriptionPlansOp} = this.#storeModel.state.subscriptions
		return renderOp(subscriptionPlansOp, plans => html`
			<ul>
				${plans.map((plan, index) => html`
					<li>
						<p>label: ${plan.label}</p>
						<p>plan id: ${plan.planId}</p>
						<p>role id: ${plan.roleId}</p>
						<p>time created: ${plan.time}</p>
						<p>tiers:</p>
						<ul>
							${plan.tiers.map(tier => html`
								<li>
									<p>tier label: ${tier.label}</p>
									<p>tier id: ${tier.tierId}</p>
									<p>role id: ${tier.roleId}</p>
									<p>price: ${tier.price}</p>
									<p>time created: ${tier.time}</p>
									<p>active: ${tier.active ?"true" :"false"}</p>
								</li>
							`)}
						</ul>
					</li>
					<xio-button @click=${() => {
							const isOpen = index === this.whichTierDraftPanelIsOpen
							this.whichTierDraftPanelIsOpen = isOpen
								? undefined
								: index
						}}>
						+ Add Tier
					</xio-button>
					${index === this.whichTierDraftPanelIsOpen
						? this.#renderTierDraftPanel(plan.planId)
						: null}
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
		const connectStatus = ops.value(this.#storeModel.state.stripeConnect.connectStatusOp)
		return html`
			<h3>Subscription Planning</h3>
			${connectStatus === StripeConnectStatus.Ready
				? allowance.manageStore
					? this.#renderPlanning()
					: html`<p>your account does not have permissions to manage the store</p>`
				: html`
					<p>store is not active</p>
				`}
		`
	}
}
