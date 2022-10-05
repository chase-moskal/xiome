
import {Service} from "../../../types/service.js"
import {makeBillingService} from "../backend/services/billing.js"
import {makeConnectService} from "../backend/services/connect.js"
import {makeSubscriptionObserverService} from "../backend/services/subscriptions/observer.js"
import {makeSubscriptionPlanningService} from "../backend/services/subscriptions/planning.js"
import {makeSubscriptionShoppingService} from "../backend/services/subscriptions/shopping.js"

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
