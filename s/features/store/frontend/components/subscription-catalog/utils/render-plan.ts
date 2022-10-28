
import {html} from "lit"
import {renderTier} from "./render-tier.js"
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"
import {CatalogRenderingParams} from "../catalog-rendering-params.js"

export function renderPlan(
		params: CatalogRenderingParams
	) {

	return (plan: SubscriptionPlan) => html`
		<li data-plan=${plan.planId} data-plan>
			<h3 data-plan-label>${plan.label}</h3>
			<div data-tiers>
				${
					plan.tiers
						.filter(tier => tier.active)
						.map(tier => renderTier(params, plan, tier))
				}
			</div>
		</li>
	`
}
