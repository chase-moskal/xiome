
import {html} from "lit"

import {TierBasics} from "../../../views/tier/types.js"
import {CatalogRenderingParams} from "../catalog-rendering-params.js"
import {SubscriptionPlan, SubscriptionTier} from "../../../../isomorphic/concepts.js"
import {ascertainTierContext} from "../../../views/tier/utils/ascertain-tier-context.js"
import {ascertainTierInteractivity} from "../../../views/tier/utils/apprehend-tier-interactivity.js"

export function renderTier(
		params: CatalogRenderingParams,
		plan: SubscriptionPlan,
		tier: SubscriptionTier,
	) {

	const {
		slots,
		modals,
		billing,
		paymentMethod,
		subscriptions,
		mySubscriptionDetails,
		setOp,
	} = params

	const subscription = (
		mySubscriptionDetails
			.find(s => s.planId === plan.planId)
	)

	const basics: TierBasics = {
		plan,
		tier,
		subscription,
		pricing: tier.pricing && tier.pricing[0],
	}

	const context = ascertainTierContext(basics)

	const interactivity = ascertainTierInteractivity({
		basics,
		context,
		modals,
		billing,
		subscriptions,
		paymentMethod,
		setOp,
	})

	const hasPricing = !!basics.pricing

	return hasPricing
		? html`
			<xiome-store-subscription-tier
				.basics=${basics}
				.context=${context}
				.interactivity=${interactivity}>
					${slots.get(tier.tierId)}
			</xiome-store-subscription-tier>
		`
		: null
}
