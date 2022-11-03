
import {suite} from "../../../../types/suite.js"
import {connectedStore, storeWithSubscriptionPlans} from "../utils/common-setups.js"

export default suite({
	"the system doesn't explode when": {
		async "customer record is deleted"() {
			const {api} = await connectedStore()
			const customer = await api.client(api.roles.customer)
			await customer.browserTab()
			await api.circuit.mockStripeOperations.wipeAll.customers()
			await customer.browserTab()
		},
		async "products are deleted"() {
			const {api} = await storeWithSubscriptionPlans()
			await api.circuit.mockStripeOperations.wipeAll.products()
			const customer = await api.client(api.roles.customer)
			await customer.browserTab()
		},
	},
})
