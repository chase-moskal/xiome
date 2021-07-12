
import {CardClues} from "../../../../stripe2/liaison/types/card-clues.js"

export type SubscriptionRow = {
	userId: string
	active: boolean
	renewalTime: number
	id_subscriptionPlan: string
	stripeSubscriptionId: string
} & CardClues
