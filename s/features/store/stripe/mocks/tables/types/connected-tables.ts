
import {MockCustomer} from "./rows/mock-customer.js"
import {MockSetupIntent} from "./rows/mock-setup-intent.js"
import {MockSubscription} from "./rows/mock-subscription.js"
import {MockPaymentMethod} from "./rows/mock-payment-method.js"
import {DbbyTable} from "../../../../../../toolbox/dbby/dbby-types.js"

export type ConnectedTables = {
	customers: DbbyTable<MockCustomer>
	setupIntents: DbbyTable<MockSetupIntent>
	subscriptions: DbbyTable<MockSubscription>
	paymentMethods: DbbyTable<MockPaymentMethod>
}
