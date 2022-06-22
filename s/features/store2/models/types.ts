
import {Service} from "../../../types/service.js"
import {makeBillingService} from "../api/services/billing-service.js"
import {makeConnectService} from "../api/services/connect-service.js"
import {makeSubscriptionObserverService} from "../api/services/subscription-observer-service.js"
import {makeSubscriptionPlanningService} from "../api/services/subscription-planning-service.js"
import {makeSubscriptionShoppingService} from "../api/services/subscription-shopping-service.js"

export interface StoreServices {
	connect: Service<typeof makeConnectService>
	billing: Service<typeof makeBillingService>
	subscriptionPlanning: Service<typeof makeSubscriptionPlanningService>
	subscriptionShopping: Service<typeof makeSubscriptionShoppingService>
	subscriptionObserver: Service<typeof makeSubscriptionObserverService>
}

export type StoreCheckoutPopup = ({}: {
	stripeAccountId: string
	stripeSessionId: string
	stripeSessionUrl: string
}) => Promise<void>

export interface StorePopups {
	stripeLogin: ({}: {
		url: string
		stripeAccountId: string
	}) => Promise<void>

	stripeConnect: ({}: {
		stripeAccountId: string
		stripeAccountSetupLink: string
	}) => Promise<void>

	checkoutPaymentMethod: StoreCheckoutPopup
	checkoutSubscription: StoreCheckoutPopup
}
