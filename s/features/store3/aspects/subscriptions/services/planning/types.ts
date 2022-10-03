
export interface SubscriptionPricingDraft {
	price: number
	currency: "usd"
	interval: "month" | "year"
}

export interface SubscriptionTierDraft {
	label: string
	pricing: SubscriptionPricingDraft
}

export interface SubscriptionPlanDraft {
	planLabel: string
	tier: SubscriptionTierDraft
}

export interface EditPlanDraft {
	planId: string
	label: string
	archived: boolean
}

export interface EditTierDraft {
	tierId: string
	label: string
	active: boolean
	pricing: SubscriptionPricingDraft
}
