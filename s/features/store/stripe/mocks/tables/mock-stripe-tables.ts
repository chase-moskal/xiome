
import {MockAccount} from "./types/tables/mock-account.js"
import {dbbyX} from "../../../../../toolbox/dbby/dbby-x.js"
import {MockCustomer} from "./types/tables/mock-customer.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {MockSetupIntent} from "./types/tables/mock-setup-intent.js"
import {MockSubscription} from "./types/tables/mock-subscription.js"
import {MockPaymentMethod} from "./types/tables/mock-payment-method.js"
import {prepareConstrainTables} from "../../../../../toolbox/dbby/dbby-constrain.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStripeTables({
			tableStorage,
			stripeConnectAccountId,
		}: {
			tableStorage: FlexStorage
			stripeConnectAccountId: undefined | string
		}) {

	const tables = await concurrent({
		accounts: dbbyX<MockAccount>(tableStorage, "mock-stripe-accounts"),
		customers: dbbyX<MockCustomer>(tableStorage, "mock-stripe-customers"),
		setupIntents: dbbyX<MockSetupIntent>(tableStorage, "mock-stripe-setupIntents"),
		subscriptions: dbbyX<MockSubscription>(tableStorage, "mock-stripe-subscriptions"),
		paymentMethods: dbbyX<MockPaymentMethod>(tableStorage, "mock-stripe-paymentMethods"),
	})

	return prepareConstrainTables(tables)({
		"_connectAccountId": stripeConnectAccountId
	})
}
