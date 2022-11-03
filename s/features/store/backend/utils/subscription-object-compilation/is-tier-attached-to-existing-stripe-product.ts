
import {SubscriptionTierRow} from "../../database/types/rows/subscription-tier-row.js"

export function isTierAttachedToExistingStripeProduct(
		tierRow: SubscriptionTierRow,
		stripeProductIds: string[],
	) {

	return stripeProductIds.includes(tierRow.stripeProductId)
}
