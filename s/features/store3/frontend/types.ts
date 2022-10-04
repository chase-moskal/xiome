
import {Service} from "../../../types/service.js"
import {makeBillingService} from "../aspects/billing/service.js"
import {makeConnectService} from "../aspects/connect/service.js"
import {makeSubscriptionObserverService} from "../aspects/subscriptions/observer/service.js"
import {makeSubscriptionPlanningService} from "../aspects/subscriptions/planning/service.js"
import {makeSubscriptionShoppingService} from "../aspects/subscriptions/shopping/service.js"

export interface StoreServices {
	connect: Service<typeof makeConnectService>
	billing: Service<typeof makeBillingService>
	subscriptionPlanning: Service<typeof makeSubscriptionPlanningService>
	subscriptionShopping: Service<typeof makeSubscriptionShoppingService>
	subscriptionObserver: Service<typeof makeSubscriptionObserverService>
}

// export type StoreCheckoutPopup = ({}: {
// 	stripeAccountId: string
// 	stripeSessionId: string
// 	stripeSessionUrl: string
// }) => Promise<void>

// export interface StorePopups {
// 	stripeLogin: ({}: {
// 		url: string
// 		stripeAccountId: string
// 	}) => Promise<void>

// 	stripeConnect: ({}: {
// 		stripeAccountId: string
// 		stripeAccountSetupLink: string
// 	}) => Promise<void>

// 	checkoutPaymentMethod: StoreCheckoutPopup
// 	checkoutSubscription: StoreCheckoutPopup
// }
