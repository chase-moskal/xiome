
import * as renraku from "renraku"
import {StoreServiceOptions} from "../../types/store-concepts.js"

export const makeBillingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(() => ({
	async getPaymentMethodDetails() {},
	async establishPaymentMethod() {},
	async updatePaymentMethod() {},
	async disconnectPaymentMethod() {},
}))
