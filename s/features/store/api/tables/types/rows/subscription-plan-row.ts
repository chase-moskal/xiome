
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"

export type SubscriptionPlanRow = {
	id_subscriptionPlan: string
	price: number
	roleId: DamnId
	active: boolean
	stripePriceId: string
	stripeProductId: string
}
