
import {planningUi} from "./ui/planning-ui.js"
import {ops} from "../../../../framework/ops.js"
import {makeStoreModel} from "../../models/store-model.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {makePlanningComponentSnap} from "./ui/planning-component-snap.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {Component, html, mixinRequireShare} from "../../../../framework/component.js"

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
		const {allowance} = this.#storeModel
		const connectStatus = ops.value(this.#storeModel.state.stripeConnect.connectStatusOp)
		return html`
			<h3>Subscription Planning</h3>
			${connectStatus === StripeConnectStatus.Ready
				? allowance.manageStore
					? this.#planningUi.renderPlanning()
					: html`<p>your account does not have permissions to manage the store</p>`
				: html`<p>store is not active</p>`}
		`
	}
}

// export class XiomeSubscriptionPlanning_Old extends mixinRequireShare<{
// 		modals: ModalSystem
// 		storeModel: ReturnType<typeof makeStoreModel>
// 	}>()(Component) {

// 	get #storeModel() {
// 		return this.share.storeModel
// 	}

// 	@property()
// 	private isPlanDraftPanelOpen: boolean = false

// 	@property()
// 	private whichTierDraftPanelIsOpen: undefined | number = undefined

// 	@property()
// 	private planDraftLoading: boolean = false

// 	@property()
// 	private tierDraftLoading: boolean = false

// 	#togglePlanDraftPanel = () => {
// 		this.isPlanDraftPanelOpen = !this.isPlanDraftPanelOpen
// 	}

// 	async init() {
// 		await this.#storeModel.initialize()
// 	}

// 	#submitNewPlan = async() => {
// 		const elements = {
// 			planlabel: select<XioTextInput>(
// 				`.plandraft xio-text-input[data-field="planlabel"]`,
// 				this.shadowRoot
// 			),
// 			tierlabel: select<XioTextInput>(
// 				`.plandraft xio-text-input[data-field="tierlabel"]`,
// 				this.shadowRoot
// 			),
// 			tierprice: select<XioTextInput>(
// 				`.plandraft xio-text-input[data-field="tierprice"]`,
// 				this.shadowRoot
// 			),
// 		}
// 		const draft: SubscriptionPlanDraft = {
// 			planLabel: elements.planlabel.value,
// 			tierLabel: elements.tierlabel.value,
// 			tierPrice: priceInCents(elements.tierprice.value),
// 		}
// 		try {
// 			this.planDraftLoading = true
// 			await this.#storeModel.subscriptionsSubmodel.addPlan(draft)
// 		}
// 		finally {
// 			this.isPlanDraftPanelOpen = false
// 			this.planDraftLoading = false
// 		}
// 		elements.planlabel.text = ""
// 		elements.tierlabel.text = ""
// 		elements.tierprice.text = ""
// 	}

// 	#submitNewTier = (planId: string) => async() => {
// 		const elements = {
// 			tierlabel: select<XioTextInput>(
// 				`.tierdraft xio-text-input[data-field="tierlabel"]`,
// 				this.shadowRoot
// 			),
// 			tierprice: select<XioTextInput>(
// 				`.tierdraft xio-text-input[data-field="tierprice"]`,
// 				this.shadowRoot
// 			),
// 		}
// 		try {
// 			this.tierDraftLoading = true
// 			await this.#storeModel.subscriptionsSubmodel.addTier({
// 				planId,
// 				label: elements.tierlabel.value,
// 				price: priceInCents(elements.tierprice.value),
// 				currency: "usd",
// 				interval: "month",
// 			})
// 		}
// 		finally {
// 			this.whichTierDraftPanelIsOpen = undefined
// 			this.tierDraftLoading = false
// 		}
// 	}

// 	#renderPlanDraftPanel() {
// 		const {planDraftLoading: loading} = this
// 		return html`
// 			<div class=plandraft>
// 				<xio-text-input
// 					data-field=planlabel
// 					?disabled=${loading}
// 					.validator=${validateLabel}>
// 						plan label</xio-text-input>
// 				<xio-text-input
// 					data-field=tierlabel
// 					?disabled=${loading}
// 					.validator=${validateLabel}>
// 						tier label</xio-text-input>
// 				<xio-text-input
// 					data-field=tierprice
// 					?disabled=${loading}
// 					.validator=${validatePriceString}>
// 						tier price</xio-text-input>
// 				<xio-button
// 					?disabled=${loading}
// 					@click=${this.#submitNewPlan}>
// 						Submit new plan</xio-button>
// 			</div>
// 		`
// 	}

// 	#renderTierDraftPanel(planId: string) {
// 		const {tierDraftLoading: loading} = this
// 		return html`
// 			<div class=tierdraft>
// 				<xio-text-input
// 					data-field=tierlabel
// 					?disabled=${loading}
// 					.validator=${validateLabel}>
// 						tier label</xio-text-input>
// 				<xio-text-input
// 					data-field=tierprice
// 					?disabled=${loading}
// 					.validator=${validatePriceString}>
// 						tier price</xio-text-input>
// 			</div>
// 			<xio-button
// 				?disabled=${loading}
// 				@click=${this.#submitNewTier(planId)}>
// 					Submit new tier</xio-button>
// 		`
// 	}

// 	@property()
// 	private planEditing: undefined | EditPlanDraft

// 	@property()
// 	private tierEditing: undefined | EditTierDraft

// 	@property()
// 	private planProblems: string[] = []

// 	@property()
// 	private tierProblems: string[] = []

// 	#setPlanEditingDraft(draft: undefined | EditPlanDraft) {
// 		this.planEditing = draft
// 		if (draft)
// 			this.planProblems = validateEditPlanDraft(draft)
// 	}

// 	#setTierEditingDraft(draft: undefined | EditTierDraft) {
// 		this.tierEditing = draft
// 		if (draft)
// 			this.tierProblems = validateEditTierDraft(draft)
// 	}

// 	#renderEditablePlan(plan: SubscriptionPlan, index: number) {
// 		const isEditing = this.planEditing?.planId === plan.planId
// 		const handleEditPress = () => {
// 			this.#setPlanEditingDraft(
// 				isEditing
// 					? undefined
// 					: {
// 						planId: plan.planId,
// 						label: plan.label,
// 						active: plan.active,
// 					}
// 			)
// 		}
// 		const hasEditingChanges = () => {
// 			if (this.planEditing.label !== plan.label)
// 				return true
// 			if (this.planEditing.active !== plan.active)
// 				return true
// 			return false
// 		}
// 		const handleSave = async() => {
// 			const {planId, label, active} = this.planEditing
// 			this.planEditing = undefined
// 			await this.#storeModel.subscriptionsSubmodel.editPlan({
// 				planId, label, active
// 			})
// 		}
// 		const activeTiers: SubscriptionTier[] = []
// 		const inactiveTiers: SubscriptionTier[] = []
// 		for (const tier of plan.tiers) {
// 			if (tier.active)
// 				activeTiers.push(tier)
// 			else
// 				inactiveTiers.push(tier)
// 		}
// 		return html`
// 			<li data-plan="${plan.planId}">
// 				<xio-button @press=${handleEditPress}>
// 					edit plan
// 				</xio-button>
// 				<p>plan id: <xio-id id="${plan.planId}"></xio-id></p>
// 				<p>role id: <xio-id id="${plan.roleId}"></xio-id></p>
// 				<p>created: ${formatDate(plan.time).full}</p>
// 				${isEditing
// 					? html`
// 						<xio-text-input
// 							.text="${plan.label}"
// 							.validator=${validateLabel}
// 							@valuechange=${(event: ValueChangeEvent<string>) => {
// 								this.#setPlanEditingDraft({
// 									...this.planEditing,
// 									label: event.detail.value,
// 								})
// 							}}>
// 								label
// 						</xio-text-input>
// 						<p>
// 							active:
// 							<input
// 								type=checkbox
// 								?checked=${plan.active}
// 								@change=${(event: InputEvent) => {
// 									this.#setPlanEditingDraft({
// 										...this.planEditing,
// 										active: (<HTMLInputElement>event.target).checked,
// 									})
// 								}}/>
// 						</p>
// 						${hasEditingChanges()
// 							? html`
// 								<xio-button
// 									?disabled=${!!this.planProblems.length}
// 									@press=${handleSave}>
// 									save plan
// 								</xio-button>
// 							`
// 							: null}
// 					`
// 					: html`
// 						<p>label: ${plan.label}</p>
// 						<p>active: ${plan.active ?"true" :"false"}</p>
// 					`}
// 				<xio-button @click=${() => {
// 						const isOpen = index === this.whichTierDraftPanelIsOpen
// 						this.whichTierDraftPanelIsOpen = isOpen
// 							? undefined
// 							: index
// 					}}>
// 					+ Add Tier
// 				</xio-button>
// 				${index === this.whichTierDraftPanelIsOpen
// 					? this.#renderTierDraftPanel(plan.planId)
// 					: null}
// 				<p>tiers:</p>
// 				<ul>
// 					${activeTiers.map(tier =>
// 						this.#renderEditableTier(plan.planId, tier))}
// 				</ul>
// 				${inactiveTiers.length
// 					? html`
// 						<details>
// 							<summary>inactive tiers</summary>
// 							<ul>
// 								${inactiveTiers.map(tier =>
// 									this.#renderEditableTier(plan.planId, tier))}
// 							</ul>
// 						</details>
// 					`
// 					: null}
// 			</li>
// 		`
// 	}

// 	#renderEditableTier(planId: string, tier: SubscriptionTier) {
// 		const isEditing = this.tierEditing?.tierId === tier.tierId
// 		const handleEditPress = () => {
// 			this.#setTierEditingDraft(
// 				isEditing
// 					? undefined
// 					: {
// 						tierId: tier.tierId,
// 						label: tier.label,
// 						active: tier.active,
// 						price: tier.price,
// 					}
// 			)
// 		}
// 		const hasEditingChanges = () => {
// 			if (this.tierEditing.label !== tier.label)
// 				return true
// 			if (this.tierEditing.active !== tier.active)
// 				return true
// 			if (this.tierEditing.price !== tier.price)
// 				return true
// 			return false
// 		}
// 		const handleSave = async() => {
// 			const {tierId, label, active, price} = this.tierEditing
// 			this.tierEditing = undefined
// 			await this.#storeModel.subscriptionsSubmodel.editTier({
// 				planId,
// 				tierId,
// 				active,
// 				label,
// 				price,
// 			})
// 		}
// 		return html`
// 			<li data-tier="${tier.tierId}">
// 				<xio-button @press=${handleEditPress}>
// 					edit tier
// 				</xio-button>
// 				<p>tier id: <xio-id id="${tier.tierId}"></xio-id></p>
// 				<p>role id: <xio-id id="${tier.roleId}"></xio-id></p>
// 				<p>created: ${formatDate(tier.time).full}</p>
// 				${isEditing
// 					? html`
// 						<xio-text-input
// 							.text="${tier.label}"
// 							.validator=${validateLabel}
// 							@valuechange=${(event: ValueChangeEvent<string>) => {
// 								if (event.detail.value) {
// 									this.#setTierEditingDraft({
// 										...this.tierEditing,
// 										label: event.detail.value,
// 									})
// 								}
// 							}}>
// 								label
// 						</xio-text-input>
// 						<xio-text-input
// 							.text="${centsToPrice(tier.price)}"
// 							.validator=${validatePriceString}
// 							@valuechange=${(event: ValueChangeEvent<string>) => {
// 								if (event.detail.value) {
// 									this.#setTierEditingDraft({
// 										...this.tierEditing,
// 										price: priceInCents(event.detail.value),
// 									})
// 								}
// 							}}>
// 								price
// 						</xio-text-input>
// 						<p>
// 							active:
// 							<input
// 								type=checkbox
// 								?checked=${tier.active}
// 								@change=${(event: InputEvent) => {
// 									this.tierEditing = {
// 										...this.tierEditing,
// 										active: (<HTMLInputElement>event.target).checked,
// 									}
// 								}}/>
// 						</p>
// 						${hasEditingChanges()
// 							? html`
// 								<xio-button
// 									?disabled=${!!this.tierProblems.length}
// 									@press=${handleSave}>
// 									save plan
// 								</xio-button>
// 							`
// 							: null}
// 					`
// 					: html`
// 						<p>tier label: ${tier.label}</p>
// 						<p>price: ${centsToPrice(tier.price)}</p>
// 						<p>active: ${tier.active ?"true" :"false"}</p>
// 					`}
// 			</li>
// 		`
// 	}

// 	#renderPlanning() {
// 		const {subscriptionPlansOp} = this.#storeModel.state.subscriptions
// 		return renderOp(subscriptionPlansOp, plans => {
// 			const activePlans: SubscriptionPlan[] = []
// 			const inactivePlans: SubscriptionPlan[] = []
// 			for (const plan of plans) {
// 				if (plan.active)
// 					activePlans.push(plan)
// 				else
// 					inactivePlans.push(plan)
// 			}
// 			return html`
// 				<xio-button @click=${this.#togglePlanDraftPanel}>
// 					+ Add Plan
// 				</xio-button>
// 				${this.isPlanDraftPanelOpen
// 					? this.#renderPlanDraftPanel()
// 					: null}
// 				<ul>
// 					${activePlans.map((plan, index) =>
// 						this.#renderEditablePlan(plan, index))}
// 				</ul>
// 				${inactivePlans.length
// 					? html`
// 						<details>
// 							<summary>inactive plans</summary>
// 							<ul>
// 								${inactivePlans.map((plan, index) =>
// 									this.#renderEditablePlan(plan, index))}
// 							</ul>
// 						</details>
// 					`
// 					: null}
// 			`
// 		})
// 	}

// 	render() {
// 		const {allowance} = this.#storeModel
// 		const connectStatus = ops.value(this.#storeModel.state.stripeConnect.connectStatusOp)
// 		return html`
// 			<h3>Subscription Planning</h3>
// 			${connectStatus === StripeConnectStatus.Ready
// 				? allowance.manageStore
// 					? this.#renderPlanning()
// 					: html`<p>your account does not have permissions to manage the store</p>`
// 				: html`<p>store is not active</p>`}
// 		`
// 	}
// }
