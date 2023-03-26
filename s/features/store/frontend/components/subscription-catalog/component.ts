
import {renderPlan} from "./utils/render-plan.js"
import {makeStoreModel} from "../../model/model.js"
import {CatalogProps} from "./utils/catalog-props.js"
import {planHasTiers} from "./utils/plan-has-tiers.js"
import {ops, Op} from "../../../../../framework/ops.js"
import {html} from "../../../../../framework/component.js"
import {planIsSpecified} from "./utils/plan-is-specified.js"
import {planIsNotArchived} from "./utils/plan-is-not-archived.js"
import {component} from "../../../../../toolbox/magical-component.js"
import {engageTemplateSlotting} from "../../utils/setup-template-slots.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {planHasTiersThatAreActive} from "./utils/plan-has-tiers-that-are-active.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"
import {planHasAtLeastOneTierWithPricing} from "./utils/plan-has-at-least-one-tier-with-pricing.js"
import {setupRerenderingOnSnapstateChanges} from "../../utils/setup-rerendering-on-snapstate-changes.js"

import styles from "./styles.js"
import {parseSpecifiedPlans} from "./utils/parse-specified-plans.js"

export const XiomeStoreSubscriptionCatalog = ({modals, storeModel}: {
	modals: ModalSystem
	storeModel: ReturnType<typeof makeStoreModel>
}) =>

component<CatalogProps>({
	styles,
	shadow: false,
	properties: {
		"plans": {type: String},
	},
},

use => {
	use.setup(() => { storeModel.initialize() })

	setupRerenderingOnSnapstateChanges(use, storeModel.snap)

	const slots = engageTemplateSlotting(use)
	const [op, setOp] = use.state<Op<void>>(ops.ready(undefined))
	const specifiedPlans = parseSpecifiedPlans(use.element.plans)

	const allPlans = (
		storeModel
			.get
			.subscriptions
			.plans
				?? []
	)

	const plans = allPlans
		.filter(planIsSpecified(specifiedPlans))
		.filter(planIsNotArchived())
		.filter(planHasTiers())
		.filter(planHasTiersThatAreActive())
		.filter(planHasAtLeastOneTierWithPricing())

	return renderOp(
		ops.combine(
			op,
			storeModel.state.subscriptions.subscriptionPlansOp,
		),
		() => html`
			<ol data-plans>
				${
					plans.map(renderPlan({
						modals,
						slots,
						billing: storeModel.billing,
						mySubscriptionDetails: storeModel.get.subscriptions.mySubscriptionDetails ?? [],
						paymentMethod: storeModel.get.billing.paymentMethod,
						subscriptions: storeModel.subscriptions,
						setOp,
					}))
				}
			</ol>
		`
	)
})
