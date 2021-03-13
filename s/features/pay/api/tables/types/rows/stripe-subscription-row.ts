
import {CardClues} from "../../../../stripe/parts/subscriptions/types/card-clues.js"

export type StripeSubscriptionRow = {
	userId: string
	renewalTime: number
	subscriptionPlanId: string
} & CardClues
