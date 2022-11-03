
import {Stripe} from "stripe"
import * as dbmage from "dbmage"
import {MockStripeTables} from "../tables/types.js"
import {getStripeId} from "../../../utils/get-stripe-id.js"

export function mockSubscriptionMechanics({
		tables,
		generateId,
	}: {
		tables: MockStripeTables
		generateId: () => string
	}) {

	async function interpretCreateItemsParam(
			createItems: Stripe.SubscriptionCreateParams["items"]
		): Promise<Stripe.Subscription["items"]> {
		const created = Date.now()
		return {
			object: "list",
			url: "",
			has_more: false,
			data: await Promise.all(
				createItems.map(async item => (<any>{
					id: generateId(),
					created,
					price: item.price,
					quantity: item.quantity,
				}))
			),
		}
	}

	async function interpretUpdateItemsParam(
			updateItems: Stripe.SubscriptionUpdateParams["items"]
		): Promise<Stripe.Subscription["items"]> {
		const created = Date.now()
		return {
			object: "list",
			url: "",
			has_more: false,
			data: await Promise.all(
				updateItems.map(async item => (<any>{
					id: generateId(),
					created,
					price: item.price,
					quantity: item.quantity,
				}))
			),
		}
	}

	async function interpretCreateParams(
			createSubscription: Stripe.SubscriptionCreateParams
		) {
		const MILLISECONDS_IN_A_MONTH = 2592000000
		return <Stripe.Subscription>{
			id: generateId(),
			customer: createSubscription.customer,
			created: Date.now(),
			default_payment_method: createSubscription.default_payment_method,
			status: "active",
			items: await interpretCreateItemsParam(createSubscription.items),
			current_period_end: Math.floor((Date.now() + MILLISECONDS_IN_A_MONTH) / 1000),
			current_period_start: Math.floor(Date.now() / 1000),
		}
	}

	async function generateInvoiceForSubscriptionItems({
			subscriptionId,
			items,
			default_payment_method,
			customer,
			current_period_end,
			current_period_start
		}: {
			subscriptionId: string
			items: Stripe.Subscription["items"]
			default_payment_method: string
			customer: string
			current_period_start: number
			current_period_end: number
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
					period: {
						end: current_period_end,
						start: current_period_start,
					}
				}
			})
		)
		const paymentMethod = default_payment_method
		const paymentIntent = <Stripe.PaymentIntent>{
			id: generateId(),
			amount,
			currency: "usd",
			customer: customer,
			payment_method: paymentMethod,
		}
		const invoice = <Stripe.Invoice>{
			id: generateId(),
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
		interpretUpdateItemsParam,
		interpretCreateParams,
		generateInvoiceForSubscriptionItems,
	}
}
