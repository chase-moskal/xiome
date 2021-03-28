
import {LiaisonConnectedOptions} from "../../../types/liaison-connected-options.js"

export function stripeLiaisonProducts({stripe, connection}: LiaisonConnectedOptions) {
	return {

		// async createSubscriptionProduct({label, currency, unit_amount}: {
		// 		label: string
		// 		currency: string
		// 		unit_amount: number
		// 	}) {
		// 	const product = await stripe.products.create({name: label}, connection)
		// 	const price = await stripe.prices.create({
		// 		product: product.id,
		// 		currency,
		// 		unit_amount,
		// 		recurring: {interval: "month"},
		// 	})
		// 	return {product, price}
		// },

		// async deleteSubscriptionProduct() {},

		// async updateSubscriptionProduct() {},
	}
}
