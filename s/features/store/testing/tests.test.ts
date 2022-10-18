
import {Suite} from "cynic"

import connect from "./suites/connect.test.js"
import consistency from "./suites/consistency.test.js"
import catalog from "./suites/subscriptions/catalog.test.js"
import customerPortal from "./suites/customer-portal.test.js"
import planning from "./suites/subscriptions/planning.test.js"

export default <Suite>{
	connect,
	customerPortal,
	subscriptions: {
		planning,
		catalog,
	},
	consistency,
}
