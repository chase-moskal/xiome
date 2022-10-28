
import {renderPlan} from "./utils/render-plan.js"
import {makeStoreModel} from "../../model/model.js"
import {CatalogProps} from "./utils/catalog-props.js"
import {ops, Op} from "../../../../../framework/ops.js"
import {html} from "../../../../../framework/component.js"
import {getActiveAndAllowedPlans} from "./utils/get-plans.js"
import {CatalogRenderingParams} from "./catalog-rendering-params.js"
import {component} from "../../../../../toolbox/magical-component.js"
import {engageTemplateSlotting} from "../../utils/setup-template-slots.js"
import {renderOp} from "../../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"
import {setupRerenderingOnSnapstateChanges} from "../../utils/setup-rerendering-on-snapstate-changes.js"

import styles from "./styles.js"

export const XiomeStoreSubscriptionCatalog = ({modals, storeModel}: {
	modals: ModalSystem
	storeModel: ReturnType<typeof makeStoreModel>
}) =>

component<CatalogProps>({
	styles,
	shadow: false,
	properties: {
		"allow-plans": {type: String},
	},
},

use => {
	setupRerenderingOnSnapstateChanges(use, storeModel.snap)
	const slots = engageTemplateSlotting(use)
	const plans = getActiveAndAllowedPlans(use.element, storeModel)
	const [op, setOp] = use.state<Op<void>>(ops.ready(undefined))

	const params: CatalogRenderingParams = {
		modals,
		storeModel,
		slots,
		setOp,
	}

	return renderOp(
		ops.combine(
			op,
			storeModel.state.subscriptions.subscriptionPlansOp,
			storeModel.state.subscriptions.mySubscriptionDetailsOp,
		),
		() => html`
			<ol data-plans>
				${plans.map(plan => renderPlan(params, plan))}
			</ol>
		`
	)
})
