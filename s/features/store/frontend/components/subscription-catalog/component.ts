
import {html} from "lit"
import {property} from "lit/decorators.js"

import {makeStoreModel} from "../../model/model.js"
import {RenderTier} from "../../views/render-tier.js"
import {ops, Op} from "../../../../../framework/ops.js"
import {preparePurchaseActions} from "./utils/subscription-actions.js"
import {centsToDollars} from "../subscription-planning/ui/price-utils.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"
import {mixinStyles, mixinRequireShare, Component} from "../../../../../framework/component.js"
import {determinePurchaseScenario} from "../../../isomorphic/utils/determine-purchase-scenario.js"
import {SubscriptionTier, SubscriptionDetails, SubscriptionStatus, PurchaseScenario, SubscriptionPlan} from "../../../isomorphic/concepts.js"

import {ascertainTierContext, ascertainTierInteractivity, TierBasics} from "../../utils/apprehend-tier-info.js"

import styles from "./styles.js"

@mixinStyles(styles)
export class XiomeStoreSubscriptionCatalog extends mixinRequireShare<{
		modals: ModalSystem
		storeModel: ReturnType<typeof makeStoreModel>
	}>()(Component) {

	@property({type: String})
	["allow-plans"]: string

	get #storeModel() {
		return this.share.storeModel
	}

	get #plans() {
		const allowedPlans = this["allow-plans"]?.match(/(\w+)/g)
		const plans = this.#storeModel.get.subscriptions.plans ?? []
		const activePlans = plans
			.filter(plan => !plan.archived)
			.filter(plan => plan.tiers.length)
		return !!this["allow-plans"]
			? activePlans.filter(plan => allowedPlans.includes(plan.planId))
			: activePlans
	}

	@property()
	private op: Op<void> = ops.ready(undefined)

	#renderPlan = (plan: SubscriptionPlan) => {
		const {storeModel, modals} = this.share
		const {mySubscriptionDetails} = this.#storeModel.get.subscriptions
		return html`
			<li data-plan=${plan.planId} part=plan>
				<h4 part=planlabel>${plan.label}</h4>
				<div class=tiers part=tiers>
					${
						plan.tiers
							.filter(tier => tier.active)
							.map((tier) => {
								const basics: TierBasics = {
									plan,
									tier,
									mySubscriptionDetails,
								}
								const context = ascertainTierContext(basics)
								const interactivity = ascertainTierInteractivity({
									basics,
									context,
									modals,
									storeModel,
									paymentMethod: storeModel.get.billing.paymentMethod,
									setOp: op => this.op = op,
								})
								return RenderTier({
									context,
									interactivity,
									basics: {tier, plan, mySubscriptionDetails},
								})
							})
					}
				</div>
			</li>
		`
	}

	render() {
		const {subscriptionPlansOp, mySubscriptionDetailsOp} = (
			this.#storeModel.state.subscriptions
		)
		return renderOp(
			ops.combine(
				this.op,
				subscriptionPlansOp,
				mySubscriptionDetailsOp,
			),
			() => html`
				<ol class=plans>
					${this.#plans.map(this.#renderPlan)}
				</ol>
			`
		)
	}
}
