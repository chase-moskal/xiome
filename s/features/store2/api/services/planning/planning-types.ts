
import {SubscriptionPricing} from "../../../types/store-concepts.js"

export interface SubscriptionTierDraft {
	label: string
	pricing: SubscriptionPricing
}

export interface SubscriptionPlanDraft {
	planLabel: string
	tier: SubscriptionTierDraft
}

export interface EditPlanDraft {
	planId: string
	label: string
	active: boolean
}

export interface EditTierDraft {
	tierId: string
	label: string
	active: boolean
	pricing: SubscriptionPricing
}
