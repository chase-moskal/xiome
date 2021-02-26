
import {MockAccount} from "./types/tables/mock-account.js"
import {MockCustomer} from "./types/tables/mock-customer.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {MockSetupIntent} from "./types/tables/mock-setup-intent.js"
import {MockSubscription} from "./types/tables/mock-subscription.js"
import {dbbyMemory} from "../../../../../toolbox/dbby/dbby-memory.js"
import {MockPaymentMethod} from "./types/tables/mock-payment-method.js"

export async function mockStripeTables() {
	return concurrent({
		accounts: dbbyMemory<MockAccount>(),
		customers: dbbyMemory<MockCustomer>(),
		setupIntents: dbbyMemory<MockSetupIntent>(),
		subscriptions: dbbyMemory<MockSubscription>(),
		paymentMethods: dbbyMemory<MockPaymentMethod>(),
	})
}
