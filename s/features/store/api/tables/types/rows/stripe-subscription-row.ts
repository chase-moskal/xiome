
import {CardClues} from "../../../../stripe/parts/subscriptions/types/card-clues.js"

export type SubscriptionRow = {
	userId: string
	renewalTime: number
	subscriptionPlanId: string
	stripeSubscriptionId: string
} & CardClues
