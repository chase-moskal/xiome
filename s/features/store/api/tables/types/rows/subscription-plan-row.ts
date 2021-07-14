
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"

export type SubscriptionPlanRow = {
	subscriptionPlanId: DamnId
	price: number
	roleId: DamnId
	active: boolean
	stripePriceId: string
	stripeProductId: string
}
