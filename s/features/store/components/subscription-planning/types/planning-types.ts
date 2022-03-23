
export interface SubscriptionPlanDraft {
	planLabel: string
	tierLabel: string
	tierPrice: number
}

export interface SubscriptionTierDraft {
	label: string
	price: number
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
	price: number
}
