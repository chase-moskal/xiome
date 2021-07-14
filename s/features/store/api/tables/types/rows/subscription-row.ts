
import {CardClues} from "../../../../stripe2/liaison/types/card-clues.js"

export type SubscriptionRow = {
	userId: string
	active: boolean
	renewalTime: number
	subscriptionPlanId: string
	stripeSubscriptionId: string
} & CardClues
