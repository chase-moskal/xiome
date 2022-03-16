
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {MockStripeTables} from "../tables/types/mock-stripe-database.js"
import {getStripeId} from "../../liaison/helpers/get-stripe-id.js"

export function mockSubscriptionMechanics({
		tables,
		generateId,
	}: {
		tables: MockStripeTables
		generateId: () => dbmage.Id
	}) {

	async function subscriptionCreateItemsToActualItems(
			createItems: Stripe.SubscriptionCreateParams["items"]
		): Promise<Stripe.Subscription["items"]> {
		const created = Date.now()
		return {
			object: "list",
			url: "",
			has_more: false,
			data: await Promise.all(
				createItems.map(async item => (<Stripe.SubscriptionItem>{
					id: generateId().string,
					created,
					price: <Stripe.Price>await tables.prices
						.readOne(dbmage.find({id: item.price})),
					quantity: item.quantity,
				}))
			),
		}
	}

	async function subscriptionUpdateItemsToActualItems(
			updateItems: Stripe.SubscriptionUpdateParams["items"]
		): Promise<Stripe.Subscription["items"]> {
		const created = Date.now()
		return {
			object: "list",
			url: "",
			has_more: false,
			data: await Promise.all(
				updateItems.map(async item => (<Stripe.SubscriptionItem>{
					id: generateId().string,
					created,
					price: <Stripe.Price>await tables.prices
						.readOne(dbmage.find({id: item.price})),
					quantity: item.quantity,
				}))
			),
		}
	}

	async function subscriptionCreateToActual(
			createSubscription: Stripe.SubscriptionCreateParams
		) {
		return <Stripe.Subscription>{
			id: generateId().string,
			customer: createSubscription.customer,
			created: Date.now(),
			default_payment_method: createSubscription.default_payment_method,
			status: "active",
			items: await subscriptionCreateItemsToActualItems(createSubscription.items),
		}
	}

	async function generateInvoiceForSubscriptionItems({
			subscriptionId,
			items,
			default_payment_method,
			customer,
		}: {
			subscriptionId: string
			items: Stripe.Subscription["items"]
			default_payment_method: string
			customer: string
		}) {
		let amount = 0
		const lineData = await Promise.all(
			items.data.map(async item => {
				const price = <Stripe.Price><any>await tables.prices.readOne(
					dbmage.find({id: getStripeId(item.price)})
				)
				amount += price.unit_amount * item.quantity
				return {
					quantity: item.quantity,
					price: {
						type: "recurring",
						id: price.id,
					},
				}
			})
		)
		const paymentMethod = default_payment_method
		const paymentIntent = <Stripe.PaymentIntent>{
			id: generateId().string,
			amount,
			currency: "usd",
			customer: customer,
			payment_method: paymentMethod,
		}
		const invoice = <Stripe.Invoice>{
			id: generateId().string,
			customer: customer,
			subscription: subscriptionId,
			lines: {data: <any>lineData},
			payment_intent: paymentIntent.id,
		}
		await tables.paymentIntents.create(<any>paymentIntent)
		await tables.invoices.create(<any>invoice)
		return {invoice, paymentIntent}
	}

	return {
		subscriptionCreateItemsToActualItems,
		subscriptionUpdateItemsToActualItems,
		subscriptionCreateToActual,
		generateInvoiceForSubscriptionItems,
	}
}
