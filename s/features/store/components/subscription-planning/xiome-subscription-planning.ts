
import {makeStoreModel} from "../../models/store-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"

import {ops} from "../../../../framework/ops.js"
import {select} from "../../../../toolbox/select/select.js"
import {SubscriptionPlanDraft} from "./types/planning-types.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {Component, html, mixinRequireShare, property} from "../../../../framework/component.js"
import {StripeConnectStatus, SubscriptionPlan, SubscriptionTier} from "../../types/store-concepts.js"
import {validateLabel, validatePriceString} from "../../api/services/validators/planning-validators.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"

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

	@property()
	private planDraftLoading: boolean = false

	@property()
	private tierDraftLoading: boolean = false

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
		try {
			this.planDraftLoading = true
			await this.#storeModel.subscriptionsSubmodel.addPlan(draft)
		}
		finally {
			this.isPlanDraftPanelOpen = false
			this.planDraftLoading = false
		}
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
		try {
			this.tierDraftLoading = true
			await this.#storeModel.subscriptionsSubmodel.addTier({
				planId,
				label: elements.tierlabel.value,
				price: priceInCents(elements.tierprice.value),
				currency: "usd",
				interval: "month",
			})
		}
		finally {
			this.whichTierDraftPanelIsOpen = undefined
			this.tierDraftLoading = false
		}
	}

	#renderPlanDraftPanel() {
		const {planDraftLoading: loading} = this
		return html`
			<div class=plandraft>
				<xio-text-input
					data-field=planlabel
					?disabled=${loading}
					.validator=${validateLabel}>
						plan label</xio-text-input>
				<xio-text-input
					data-field=tierlabel
					?disabled=${loading}
					.validator=${validateLabel}>
						tier label</xio-text-input>
				<xio-text-input
					data-field=tierprice
					?disabled=${loading}
					.validator=${validatePriceString}>
						tier price</xio-text-input>
				<xio-button
					?disabled=${loading}
					@click=${this.#submitNewPlan}>
						Submit new plan</xio-button>
			</div>
		`
	}

	#renderTierDraftPanel(planId: string) {
		const {tierDraftLoading: loading} = this
		return html`
			<div class=tierdraft>
				<xio-text-input
					data-field=tierlabel
					?disabled=${loading}
					.validator=${validateLabel}>
						tier label</xio-text-input>
				<xio-text-input
					data-field=tierprice
					?disabled=${loading}
					.validator=${validatePriceString}>
						tier price</xio-text-input>
			</div>
			<xio-button
				?disabled=${loading}
				@click=${this.#submitNewTier(planId)}>
					Submit new tier</xio-button>
		`
	}

	@property()
	private planEditing: undefined | {
		planId: string
		label: string
		active: boolean
	}

	@property()
	private tierEditing = {}

	#renderEditablePlan(plan: SubscriptionPlan) {
		const isEditing = this.planEditing?.planId === plan.planId
		const handleEditPress = () => {
			this.planEditing = isEditing
				? undefined
				: {
					planId: plan.planId,
					label: plan.label,
					active: plan.active,
				}
		}
		const hasEditingChanges = () => {
			if (this.planEditing.label !== plan.label)
				return true
			if (this.planEditing.active !== plan.active)
				return true
			return false
		}
		const handleSave = async() => {
			const {planId, label, active} = this.planEditing
			this.planEditing = undefined
			await this.#storeModel.subscriptionsSubmodel.editPlan({
				planId, label, active
			})
		}
		return html`
			<li>
				<xio-button @press=${handleEditPress}>
					edit
				</xio-button>
				<p>plan id: <xio-id id="${plan.planId}"></xio-id></p>
				<p>role id: <xio-id id="${plan.roleId}"></xio-id></p>
				<p>created: ${formatDate(plan.time).full}</p>
				${isEditing
					? html`
						<xio-text-input
							.text="${this.planEditing.label}"
							.validator=${validateLabel}
							@valuechange=${(event: ValueChangeEvent<string>) => {
								this.planEditing = {
									...this.planEditing,
									label: event.detail.value,
								}
							}}>
								label
						</xio-text-input>
						<p>
							active:
							<input
								type=checkbox
								?checked=${!!this.planEditing?.active}
								@change=${(event: InputEvent) => {
									this.planEditing = {
										...this.planEditing,
										active: (<HTMLInputElement>event.target).checked,
									}
								}}/>
						</p>
						${hasEditingChanges()
							? html`
								<xio-button @press=${handleSave}>
									save plan
								</xio-button>
							`
							: null}
					`
					: html`
						<p>label: ${plan.label}</p>
						<p>active: ${plan.active ?"true" :"false"}</p>
					`}
				<p>tiers:</p>
				<ul>
					${plan.tiers.map(tier => html`
						${this.#renderEditableTier(tier)}
					`)}
				</ul>
			</li>
		`
	}

	#renderEditableTier(tier: SubscriptionTier) {
		return html`
			<li>
				<p>tier label: ${tier.label}</p>
				<p>tier id: ${tier.tierId}</p>
				<p>role id: ${tier.roleId}</p>
				<p>price: ${tier.price}</p>
				<p>active: ${tier.active ?"true" :"false"}</p>
				<p>time created: ${tier.time}</p>
				<p>active: <input type="checkbox" ?checked=${tier.active}/></p>
			</li>
		`
	}

	#renderPlanning() {
		const {subscriptionPlansOp} = this.#storeModel.state.subscriptions
		return renderOp(subscriptionPlansOp, plans => html`
			<ul>
				${plans.map((plan, index) => html`
					${this.#renderEditablePlan(plan)}
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
				: html`<p>store is not active</p>`}
		`
	}
}
