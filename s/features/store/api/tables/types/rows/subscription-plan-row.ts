
import {SubscriptionPlanDraft} from "../drafts/subscription-plan-draft.js"

export type SubscriptionPlanRow = {
	stripePriceId: string
	stripeProductId: string
	subscriptionPlanId: string
} & SubscriptionPlanDraft
