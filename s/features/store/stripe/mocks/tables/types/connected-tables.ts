
import * as dbproxy from "../../../../../../toolbox/dbproxy/dbproxy.js"

import {MockCustomer} from "./rows/mock-customer.js"
import {MockSetupIntent} from "./rows/mock-setup-intent.js"
import {MockSubscription} from "./rows/mock-subscription.js"
import {MockPaymentMethod} from "./rows/mock-payment-method.js"

export type ConnectedTables = {
	customers: dbproxy.Table<MockCustomer>
	setupIntents: dbproxy.Table<MockSetupIntent>
	subscriptions: dbproxy.Table<MockSubscription>
	paymentMethods: dbproxy.Table<MockPaymentMethod>
}
