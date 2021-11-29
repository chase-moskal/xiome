
export interface SubscriptionPlan {
	subscriptionPlanId: string
	label: string
	roleId: string
	prices: SubscriptionPrice
}

export type SubscriptionPrice = {
	label: string
	price: number
}

export type SubscriptionPlanDraft = {
	label: string
	tiers: SubscriptionPrice[]
}

export interface SubscriptionPlanStats {
	subscriptionPlanId: string
	subscribers: number
}
