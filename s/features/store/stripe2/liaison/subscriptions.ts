
import {LiaisonOptions} from "../types/liaison-options.js"

export function stripeLiaisonSubscriptions({stripe}: LiaisonOptions) {
	return {
		async updateSubscriptionPaymentMethod() {},
		async scheduleSubscriptionCancellation() {},
		async fetchSubscriptionDetails() {},
	}
}
