
import {SubscriptionTier, SubscriptionPlan, SubscriptionDetails, SubscriptionStatus, SubscriptionPricing} from "../../../isomorphic/concepts.js"

export interface TierBasics {
	tier: SubscriptionTier
	plan: SubscriptionPlan
	subscription: SubscriptionDetails | undefined
	pricing: SubscriptionPricing | undefined
}

export enum TierButton {
	Buy,
	Upgrade,
	Downgrade,
	Pay,
	Cancel,
	Renew,
}

export interface TierInteractivity {
	button: TierButton
	action: () => Promise<void>
}

export interface TierContext {
	subscription: SubscriptionDetails | undefined
	tierIndex: number
	status: SubscriptionStatus
	subscribedTierIndex: number | undefined
	isSubscribedToThisTier: boolean
	isAnotherTierInPlanUnpaid: boolean
}
