
import {apiContext} from "renraku/x/api/api-context.js"
import {StoreServiceOptions} from "../../types/store-concepts.js"
import {StoreLinkedAuth, StoreMeta} from "../../types/store-metas-and-auths.js"

export const makeBillingService = (
		options: StoreServiceOptions
	) => apiContext<StoreMeta, StoreLinkedAuth>()({

	policy: options.storeLinkedPolicy,

	expose: {
		async getPaymentMethodDetails() {},
		async establishPaymentMethod() {},
		async updatePaymentMethod() {},
		async disconnectPaymentMethod() {},
	},
})
