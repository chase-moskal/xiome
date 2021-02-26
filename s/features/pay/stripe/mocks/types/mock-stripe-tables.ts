
import {DbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {MockCustomer} from "./tables/mock-customer.js"
import {MockPaymentMethod} from "./tables/mock-payment-method.js"
import {MockSetupIntent} from "./tables/mock-setup-intent.js"
import {MockSubscription} from "./tables/mock-subscription.js"

export interface MockStripeTables {
	customers: DbbyTable<DbbyRow & MockCustomer>
	setupIntents: DbbyTable<DbbyRow & MockSetupIntent>
	subscriptions: DbbyTable<DbbyRow & MockSubscription>
	paymentMethods: DbbyTable<DbbyRow & MockPaymentMethod>
}
