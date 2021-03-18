
import {MockAccount} from "./types/rows/mock-account.js"
import {MockCustomer} from "./types/rows/mock-customer.js"
import {dbbyX} from "../../../../../toolbox/dbby/dbby-x.js"
import {ConnectedTables} from "./types/connected-tables.js"
import {AccountingTables} from "./types/accounting-tables.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {MockSetupIntent} from "./types/rows/mock-setup-intent.js"
import {MockSubscription} from "./types/rows/mock-subscription.js"
import {MockPaymentMethod} from "./types/rows/mock-payment-method.js"
import {prepareConstrainTables} from "../../../../../toolbox/dbby/dbby-constrain.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStripeTables({tableStorage}: {
			tableStorage: FlexStorage
		}) {

	const accountingTables: AccountingTables = await concurrent({
		accounts: dbbyX<MockAccount>(tableStorage, "mock-stripe-accounts"),
	})

	const connectedTables: ConnectedTables = await concurrent({
		customers: dbbyX<MockCustomer>(tableStorage, "mock-stripe-customers"),
		setupIntents: dbbyX<MockSetupIntent>(tableStorage, "mock-stripe-setupIntents"),
		subscriptions: dbbyX<MockSubscription>(tableStorage, "mock-stripe-subscriptions"),
		paymentMethods: dbbyX<MockPaymentMethod>(tableStorage, "mock-stripe-paymentMethods"),
	})

	return {
		accountingTables,
		getConnectedTables(stripeConnectAccountId: string) {
			return prepareConstrainTables(connectedTables)({
				"_connectAccountId": stripeConnectAccountId,
			})
		}
	}
}
