
import {CardClues} from "../../../../stripe2/liaison/types/card-clues.js"

export type SubscriptionRow = {
	id_user: string
	active: boolean
	renewalTime: number
	id_subscriptionPlan: string
	stripeSubscriptionId: string
} & CardClues
