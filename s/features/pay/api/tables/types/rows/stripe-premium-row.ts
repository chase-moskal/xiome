
import {CardClues} from "../../../../stripe/parts/subscriptions/types/card-clues.js"

export type StripePremiumRow = CardClues & {
	userId: string
	stripeSubscriptionId: string
}
