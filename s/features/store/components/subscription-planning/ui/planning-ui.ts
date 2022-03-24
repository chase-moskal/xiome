
import {centsToPrice, priceInCents} from "./price-utils.js"
import {select} from "../../../../../toolbox/selects.js"
import {html} from "../../../../../framework/component.js"
import {makeStoreModel} from "../../../models/store-model.js"
import {makePlanningComponentSnap} from "./planning-component-snap.js"
import {formatDate} from "../../../../../toolbox/goodtimes/format-date.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../../../xio-components/inputs/xio-text-input.js"
import {SubscriptionPlan, SubscriptionTier} from "../../../types/store-concepts.js"
import {SubscriptionPlanDraft, SubscriptionTierDraft, EditPlanDraft} from "../types/planning-types.js"
import {validateNewPlanDraft, validateNewTierDraft, validateEditPlanDraft, validateLabel, validatePriceString} from "../../../api/services/validators/planning-validators.js"

export function planningUi({storeModel, componentSnap, getShadowRoot}: {
		storeModel: ReturnType<typeof makeStoreModel>
		componentSnap: ReturnType<typeof makePlanningComponentSnap>
		getShadowRoot: () => ShadowRoot
	}) {

	const states = {
		store: storeModel.snap.readable,
		component: componentSnap.state,
	}

	const formGathering = {
		newPlan() {
			const shadow = getShadowRoot()
			const elements = {
				planlabel: select<XioTextInput>(
					`.plandraft xio-text-input[data-field="planlabel"]`,
					shadow,
				),
				tierlabel: select<XioTextInput>(
					`.plandraft xio-text-input[data-field="tierlabel"]`,
					shadow,
				),
				tierprice: select<XioTextInput>(
					`.plandraft xio-text-input[data-field="tierprice"]`,
					shadow,
				),
			}
			const draft: SubscriptionPlanDraft = {
				planLabel: elements.planlabel.value,
				tierLabel: elements.tierlabel.value,
				tierPrice: priceInCents(elements.tierprice.value),
			}
			const problems = validateNewPlanDraft(draft)
			states.component.draftNewPlan.problems = problems
			return {draft, problems}
		},
		newTier() {
			const shadow = getShadowRoot()
			const elements = {
				label: select<XioTextInput>(
					`.tierdraft xio-text-input[data-field="tierlabel"]`,
					shadow,
				),
				price: select<XioTextInput>(
					`.tierdraft xio-text-input[data-field="tierprice"]`,
					shadow,
				),
			}
			const draft: SubscriptionTierDraft = {
				label: elements.label.value,
				price: priceInCents(elements.label.value),
			}
			const problems = validateNewTierDraft(draft)
			states.component.draftNewTier.problems = problems
			return {draft, problems}
		},
		editedPlan(plan: SubscriptionPlan) {
			const shadow = getShadowRoot()
			const elements = {
				label: select<XioTextInput>(
					`.planediting [data-field="label"]`,
					shadow,
				),
				active: select<HTMLInputElement>(
					`.planediting [data-field="active"]`,
					shadow,
				),
			}
			const draft: EditPlanDraft = {
				planId: plan.planId,
				label: elements.label.value,
				active: elements.active.checked,
			}
			const problems = validateEditPlanDraft(draft)
			const isChanged =
				draft.label !== plan.label ||
				draft.active !== plan.active
			states.component.editingPlanDraft.isChanged = isChanged
			states.component.editingPlanDraft.problems = problems
			return {draft, problems, isChanged}
		},
	}

	const actions = {
		newPlan: {
			toggleDraftPanel() {
				states.component.draftNewPlan = states.component.draftNewPlan
					? undefined
					: {loading: false, problems: []}
			},
			async submit() {
				const {draft, problems} = formGathering.newPlan()
				if (problems.length === 0) {
					try {
						states.component.draftNewPlan.loading = true
						await storeModel.subscriptionsSubmodel.addPlan(draft)
					}
					finally {
						states.component.draftNewPlan = undefined
					}
				}
			},
		},
		newTier: {
			toggleDraftPanel(planId: string) {
				states.component.draftNewTier = states.component.draftNewTier
					? undefined
					: {planId, loading: false, problems: []}
			},
			async submit(planId: string) {
				const {draft, problems} = formGathering.newTier()
				if (problems.length === 0) {
					try {
						states.component.draftNewTier.loading = true
						await storeModel.subscriptionsSubmodel.addTier({
							...draft,
							planId,
							currency: "usd",
							interval: "month",
						})
					}
					finally {
						states.component.draftNewTier = undefined
					}
				}
			},
		},
		planEditing: {
			handleEditButtonPress(plan: SubscriptionPlan) {
				const isEditing = states.component.editingPlanDraft?.planId
					=== plan.planId
				states.component.editingPlanDraft = isEditing
					? undefined
					: {
						isChanged: false,
						loading: false,
						planId: plan.planId,
						problems: [],
					}
			},
			async submit(plan: SubscriptionPlan) {
				const {draft, problems} = formGathering.editedPlan(plan)
				if (problems.length === 0) {
					try {
						states.component.editingPlanDraft.loading = true
						await storeModel.subscriptionsSubmodel.editPlan(draft)
					}
					finally {
						states.component.editingPlanDraft = undefined
					}
				}
			},
		},
	}

	const handlers = {
		planDraft: {
			valuechange: formGathering.newPlan,
		},
		tierDraft: {
			valuechange: formGathering.newTier,
		},
	}

	function renderNewPlanPanel() {
		const {loading, problems} = states.component.draftNewPlan
		return html`
			<div class=plandraft @valuechange=${handlers.planDraft.valuechange}>
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
					?disabled=${loading || problems.length}
					@click=${actions.newPlan.submit}>
						Submit new plan</xio-button>
			</div>
		`
	}

	function renderNewTierPanel(planId: string) {
		const {loading, problems} = states.component.draftNewTier
		return html`
			<div class=tierdraft @valuechange=${handlers.tierDraft.valuechange}>
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
				?disabled=${loading || problems.length}
				@click=${() => actions.newTier.submit(planId)}>
					submit new tier</xio-button>
		`
	}

	function renderTier(plan: SubscriptionPlan, tier: SubscriptionTier) {
		return html`
			<li data-tier="${tier.tierId}">
				<p>tier id: <xio-id id="${tier.tierId}"></xio-id></p>
				<p>role id: <xio-id id="${tier.roleId}"></xio-id></p>
				<p>tier label: ${tier.label}</p>
				<p>tier active: ${tier.active ?"true" :"false"}</p>
				<p>tier price: ${centsToPrice(tier.price)}</p>
				<p>created: ${formatDate(tier.time).full}</p>
			</li>
		`
	}

	function renderPlan(plan: SubscriptionPlan, index: number) {
		const isEditing = states.component.editingPlanDraft?.planId === plan.planId

		const activeTiers: SubscriptionTier[] = []
		const inactiveTiers: SubscriptionTier[] = []
		for (const tier of plan.tiers) {
			if (tier.active)
				activeTiers.push(tier)
			else
				inactiveTiers.push(tier)
		}

		return html`
			<li data-plan="${plan.planId}">
				<xio-button
					@press=${() => actions.planEditing.handleEditButtonPress(plan)}>
						edit plan
				</xio-button>
				<p>plan id: <xio-id id="${plan.planId}"></xio-id></p>
				<p>role id: <xio-id id="${plan.roleId}"></xio-id></p>
				<p>created: ${formatDate(plan.time).full}</p>
				${isEditing
					? html`
						<div class=planediting
							@change=${() => formGathering.editedPlan(plan)}
							@valuechange=${() => formGathering.editedPlan(plan)}>
								<xio-text-input
									data-field="label"
									.text="${plan.label}"
									.validator=${validateLabel}>
										label
								</xio-text-input>
								<label>
									active:
									<input
										data-field="active"
										type=checkbox
										?checked=${plan.active}/>
								</label>
								${states.component.editingPlanDraft.isChanged
									? html`
										<xio-button
											?disabled=${!!states.component.editingPlanDraft.problems.length}
											@press=${() => actions.planEditing.submit(plan)}>
												save plan
										</xio-button>
									`
									: null}
						</div>
					`
					: html`
						<p>label: ${plan.label}</p>
						<p>active: ${plan.active ?"true" :"false"}</p>
					`}
				<xio-button @click=${() => actions.newTier.toggleDraftPanel(plan.planId)}>
					+ Add Tier
				</xio-button>
				${states.component.draftNewTier?.planId === plan.planId
					? renderNewTierPanel(plan.planId)
					: null}
				<p>tiers:</p>
				<ul>
					${activeTiers.map(tier => renderTier(plan, tier))}
				</ul>
				${inactiveTiers.length
					? html`
						<details>
							<summary>inactive tiers</summary>
							<ul>
								${inactiveTiers.map(tier => renderTier(plan, tier))}
							</ul>
						</details>
					`
					: null}
			</li>
		`
	}

	function renderPlanning() {
		const {subscriptionPlansOp} = states.store.subscriptions
		return renderOp(subscriptionPlansOp, plans => {
			const activePlans: SubscriptionPlan[] = []
			const inactivePlans: SubscriptionPlan[] = []
			for (const plan of plans) {
				if (plan.active)
					activePlans.push(plan)
				else
					inactivePlans.push(plan)
			}
			return html`
				<xio-button @click=${actions.newPlan.toggleDraftPanel}>
					+ Add Plan
				</xio-button>
				${states.component.draftNewPlan
					? renderNewPlanPanel()
					: null}
				<ul>
					${activePlans.map(renderPlan)}
				</ul>
				${inactivePlans.length
					? html`
						<details>
							<summary>inactive plans</summary>
							<ul>
								${inactivePlans.map(renderPlan)}
							</ul>
						</details>
					`
					: null}
			`
		})
	}

	return {
		renderPlanning,
	}
}
