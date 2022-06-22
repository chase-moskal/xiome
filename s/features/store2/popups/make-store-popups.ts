
import {StorePopups} from "../models/types.js"

function err() {
	throw new Error("todo implement store popups")
}

export function makeStorePopups(): StorePopups {
	return {

		stripeLogin: <StorePopups["stripeLogin"]>(async() => {
			err()
		}),

		stripeConnect: <StorePopups["stripeConnect"]>(async({
				stripeAccountId,
			}) => {
			err()
		}),

		checkoutPaymentMethod: <StorePopups["checkoutPaymentMethod"]>(async({
				stripeAccountId,
				stripeSessionId,
			}) => {
			err()
		}),

		checkoutSubscription: <StorePopups["checkoutSubscription"]>(async({
				stripeAccountId,
				stripeSessionId,
			}) => {
			err()
		}),
	}
}
