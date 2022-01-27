
import * as dbmage from "dbmage"

import {MockCustomer} from "./rows/mock-customer.js"
import {MockSetupIntent} from "./rows/mock-setup-intent.js"
import {MockSubscription} from "./rows/mock-subscription.js"
import {MockPaymentMethod} from "./rows/mock-payment-method.js"

export type ConnectedTables = {
	customers: dbmage.Table<MockCustomer>
	setupIntents: dbmage.Table<MockSetupIntent>
	subscriptions: dbmage.Table<MockSubscription>
	paymentMethods: dbmage.Table<MockPaymentMethod>
}
