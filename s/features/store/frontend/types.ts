
import {Service} from "../../../types/service.js"
import {makeBillingService} from "../backend/services/billing.js"
import {makeConnectService} from "../backend/services/connect.js"
import {makeSubscriptionListingService} from "../backend/services/subscriptions/listing.js"
import {makeSubscriptionPlanningService} from "../backend/services/subscriptions/planning.js"
import {makeSubscriptionShoppingService} from "../backend/services/subscriptions/shopping.js"

export interface StoreServices {
	connect: Service<typeof makeConnectService>
	billing: Service<typeof makeBillingService>
	subscriptions: {
		listing: Service<typeof makeSubscriptionListingService>
		planning: Service<typeof makeSubscriptionPlanningService>
		shopping: Service<typeof makeSubscriptionShoppingService>
	}
}
