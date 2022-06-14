
import Stripe from "stripe"
import * as dbmage from "dbmage"
import {find, Rando} from "dbmage"

import {makeStripeLiaison} from "../stripe-liaison.js"
import {getStripeId} from "../helpers/get-stripe-id.js"
import {day} from "../../../../../toolbox/goodtimes/times.js"
import {MockStripeTables, MockAccount} from "./tables/types.js"
import {MockStripeRecentDetails, StripeWebhooks} from "../../types.js"
import {mockSubscriptionMechanics} from "./utils/mock-subscription-mechanics.js"

export function mockStripeLiaison({
		rando, tables, recentDetails, webhookEvent,
	}: {
		rando: Rando
		tables: MockStripeTables
		recentDetails: MockStripeRecentDetails
		webhookEvent: <xObject extends {}>(
			type: keyof StripeWebhooks,
			stripeAccountId: string,
			object: xObject
		) => Promise<void>
	}): ReturnType<typeof makeStripeLiaison> {

	const generateId = () => rando.randomId()
	function respond<xResource>(resource: xResource): Stripe.Response<xResource> {
		return {
			headers: {},
			lastResponse: undefined,
			...resource,
		}
	}

	const rawTables = tables

	return {

		accounts: {
			async create(params) {
				const account: Partial<Stripe.Account> = {
					id: generateId().toString(),
					type: params.type,
					email: params.email,
				}
				await tables.accounts.create(<MockAccount>account)
				return respond(<Stripe.Account>account)
			},
			async retrieve(id) {
				const account = await tables.accounts.readOne(find({id}))
				return respond(<Stripe.Account>account)
			},
			async createLoginLink(id) {
				const loginLink: Partial<Stripe.LoginLink> = {
					created: Date.now(),
					url: `https://fake.xiome.io/stripe-account-login-link`,
				}
				return respond(<Stripe.LoginLink>loginLink)
			},
		},

		accountLinks: {
			async create(params) {
				const accountLink: Partial<Stripe.AccountLink> = {
					url: `https://fake.xiome.io/stripe-account-setup`,
				}
				return respond(<Stripe.AccountLink>accountLink)
			},
		},

		account(stripeAccountId: string): any {

			const tables = <MockStripeTables>dbmage.constrainTables({
				tables: rawTables,
				constraint: {"_connectedAccount": stripeAccountId},
			})

			const subscriptionMechanics = mockSubscriptionMechanics({
				tables,
				generateId,
			})

			function ignoreUndefined<X extends {}>(input: X): X {
				const output = {}
				for (const [key, value] of Object.entries(input)) {
					if (value !== undefined)
						output[key] = value
				}
				return <X>output
			}

			function makeStandardRestResource<xResource>() {
				return function<xCreateParams, xUpdateParams>({
						table, handleCreate, handleUpdate,
					}: {
						table: dbmage.Table<any>
						handleCreate: (params: xCreateParams) => Partial<xResource>
						handleUpdate: (params: xUpdateParams) => Partial<xResource>
					}) {
					return {
						async create(params: xCreateParams) {
							const resource = <Partial<xResource>>{
								id: generateId().toString(),
								...handleCreate(params),
							}
							await table.create(resource)
							return respond(<xResource>resource)
						},
						async update(id: string, params: xUpdateParams) {
							await table.update({
								...find({id}),
								write: ignoreUndefined(handleUpdate(params)),
							})
							const resource = await table.readOne(find({id}))
							return respond(<xResource>resource)
						},
						async retrieve(id: string) {
							const resource = await table.readOne(find({id}))
							return respond<xResource>(resource)
						},
						async delete(id: string) {
							await table.delete(find({id}))
							return respond({})
						},
					}
				}
			}

			return {

				customers: {
					...makeStandardRestResource<Stripe.Customer>()({
						table: tables.customers,
						handleCreate: (params: Stripe.CustomerCreateParams) => ({
							email: params.email,
							invoice_settings: <any>params.invoice_settings
								?? {default_payment_method: undefined},
						}),
						handleUpdate: (params: Stripe.CustomerUpdateParams) => ({
							email: params.email,
							invoice_settings: <any>params.invoice_settings,
						}),
					}),
					async listPaymentMethods(
							customer: string,
							params: Stripe.CustomerListPaymentMethodsParams,
						) {
						const paymentMethods = await tables.paymentMethods.read(
							dbmage.find({customer, type: params.type})
						)
						return respond({
							object: "list",
							data: paymentMethods,
						})
					},
				},

				products: makeStandardRestResource<Stripe.Product>()({
					table: tables.products,
					handleCreate: (params: Stripe.ProductCreateParams) => ({
						name: params.name,
						description: params.description,
						active: true,
					}),
					handleUpdate: (params: Stripe.ProductUpdateParams) => ({
						name: params.name,
						active: params.active,
						description: params.description,
					}),
				}),

				prices: makeStandardRestResource<Stripe.Price>()({
					table: tables.prices,
					handleCreate: (params: Stripe.PriceCreateParams) => ({
						active: params.active === undefined ?true :params.active,
						product: params.product,
						currency: params.currency,
						unit_amount: params.unit_amount,
						recurring: <any>params.recurring,
						type: params.recurring ?"recurring" :"one_time",
					}),
					handleUpdate: (params: Stripe.PriceUpdateParams) => ({
						active: params.active,
					}),
				}),

				checkout: {
					sessions: makeStandardRestResource<Stripe.Checkout.Session>()({
						table: tables.checkoutSessions,
						handleCreate: (params: Stripe.Checkout.SessionCreateParams) => ({
							mode: params.mode,
							customer: params.customer,
							client_reference_id: params.client_reference_id,
							line_items: params.mode === "setup"
								? undefined
								: {
									object: "list",
									has_more: false,
									url: undefined,
									data: params.line_items.map(item => <any>({
										id: rando.randomId().string,
										object: "item",
										quantity: item.quantity,
										price: item.price,
									})),
								},
						}),
						handleUpdate: (params: Stripe.Checkout.Session) => ({}),
					}),
				},

				paymentMethods: (() => {
					const resource = makeStandardRestResource<Stripe.PaymentMethod>()({
						table: tables.paymentMethods,
						handleCreate: (params: Stripe.PaymentMethodCreateParams) => ({
							type: params.type,
							customer: params.customer,
							card: <any>params.card,
						}),
						handleUpdate: (params: Stripe.PaymentMethodUpdateParams) => ({
							card: <any>params.card,
						}),
					})
					return {
						...resource,
						delete: undefined,
						async detach(id: string) {
							const paymentMethod = resource.retrieve(id)
							await resource.delete(id)
							return respond(paymentMethod)
						}
					}
				})(),

				setupIntents: makeStandardRestResource<Stripe.SetupIntent>()({
					table: tables.setupIntents,
					handleCreate: (params: Stripe.SetupIntentCreateParams) => ({
						customer: params.customer,
						payment_method: params.payment_method,
						usage: params.usage,
					}),
					handleUpdate: (params: Stripe.SetupIntentUpdateParams) => ({
						payment_method: params.payment_method,
					}),
				}),

				paymentIntents: makeStandardRestResource<Stripe.PaymentIntent>()({
					table: tables.setupIntents,
					handleCreate: (params: Stripe.PaymentIntentCreateParams) => ({
						customer: params.customer,
						payment_method: params.payment_method,
						amount: params.amount,
						currency: params.currency,
					}),
					handleUpdate: (params: Stripe.PaymentIntentUpdateParams) => ({
						customer: params.customer,
						payment_method: params.payment_method,
						amount: params.amount,
						currency: params.currency,
					}),
				}),

				subscriptions: (() => {
					const resource = makeStandardRestResource<Stripe.Subscription>()({
						table: tables.subscriptions,
						handleCreate: (params: Stripe.SubscriptionCreateParams) => ({
							customer: params.customer,
							status: "active",
							current_period_start: Date.now(),
							current_period_end: Date.now() + (30 * day),
							default_payment_method: params.default_payment_method,
							cancel_at_period_end: params.cancel_at_period_end,
							items: {
								url: "",
								object: "list",
								has_more: false,
								data: <any>params.items.map(itemParams => ({
									id: generateId().toString(),
									billing_thresholds: itemParams.billing_thresholds,
									price: itemParams.price,
									price_data: itemParams.price_data,
									quantity: itemParams.quantity,
									tax_rates: itemParams.tax_rates,
								})),
							},
						}),
						handleUpdate: (params: Stripe.SubscriptionUpdateParams) => ({
							cancel_at_period_end: params.cancel_at_period_end,
							default_payment_method: params.default_payment_method,
						}),
					})
					return {
						...resource,
						async create(params: Stripe.SubscriptionCreateParams) {
							const subscription = await subscriptionMechanics
								.subscriptionCreateToActual(params)
							await tables.subscriptions.create(<any>subscription)
							const {invoice, paymentIntent} = await subscriptionMechanics
								.generateInvoiceForSubscriptionItems({
									customer: <string>subscription.customer,
									default_payment_method: <string>subscription
										.default_payment_method,
									subscriptionId: subscription.id,
									items: subscription.items,
								})
							recentDetails.subscriptionCreation = {
								subscription,
								paymentIntent: <Stripe.PaymentIntent>paymentIntent,
							}
							await webhookEvent(
								"invoice.paid",
								stripeAccountId,
								invoice,
							)
							return subscription
						},
						async update(id: string, params: Stripe.SubscriptionUpdateParams) {
							const existingSubscription = <Stripe.Subscription>await resource.retrieve(id)
							const write: Partial<Stripe.Subscription> = {}
							if (params.cancel_at_period_end !== undefined) {
								write.cancel_at_period_end = params.cancel_at_period_end
							}
							if (params.default_payment_method !== undefined) {
								write.default_payment_method = params.default_payment_method
							}
							if (params.items !== undefined) {
								const newItems = params.items.filter(item => {
									const foundExisting = existingSubscription.items.data
										.find(existingItem =>
											getStripeId(existingItem.price) === item.price
										)
									return !foundExisting
								})
								const items = await subscriptionMechanics
									.subscriptionUpdateItemsToActualItems(newItems)
								const {invoice} = await subscriptionMechanics.generateInvoiceForSubscriptionItems({
									customer: <string>existingSubscription.customer,
									default_payment_method: <string>existingSubscription
										.default_payment_method,
									subscriptionId: id,
									items,
								})
								await webhookEvent(
									"invoice.paid",
									stripeAccountId,
									invoice,
								)
								write.items = items
							}
							await tables.subscriptions.update({
								...dbmage.find({id}),
								write: <any>write,
							})
							return resource.retrieve(id)
						},
						async list(params: Stripe.SubscriptionListParams) {
							const subscriptions = await tables.subscriptions.read(
								dbmage.find(
									params.price
										? <any>{customer: params.customer, price: params.price}
										: {customer: params.customer}
								)
							)
							return respond({
								object: "list",
								data: subscriptions,
							})
						}
					}
				})(),
			}
		}
	}
}
