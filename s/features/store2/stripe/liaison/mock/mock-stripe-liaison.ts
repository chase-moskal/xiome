
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

			function prepMockResource<xResource>(table: dbmage.Table<any>) {
				return {
					create<xParams>({makeData, hook = async() => {}}: {
							makeData: (params: xParams) => Partial<xResource>
							hook?: (resource: xResource) => Promise<void>
						}) {
						return async function(params: xParams) {
							const resource = <Partial<xResource>><any>{
								id: generateId().toString(),
								...makeData(params),
							}
							await table.create(resource)
							await hook(<xResource>resource)
							return respond(<xResource>resource)
						}
					},
					retrieve() {
						return async function(id: string) {
							const resource = await table.readOne(find({id}))
							return respond<xResource>(resource)
						}
					},
					update<xParams>({makeData, hook = async() => {}}: {
							makeData: (params: xParams) => Partial<xResource>
							hook?: (resource: xResource) => Promise<void>
						}) {
						return async function(id: string, params: xParams) {
							await table.update({
								...find({id}),
								write: ignoreUndefined(makeData(params)),
							})
							const resource = await table.readOne(find({id}))
							await hook(<xResource>resource)
							return respond(<xResource>resource)
						}
					},
					delete() {
						return async function(id: string) {
							await table.delete(find({id}))
						}
					},
				}
			}

			function mockResource<xResource, xCreateParams, xUpdateParams>({
					table,
					createData,
					updateData,
					createHook,
					updateHook,
				}: {
					table: dbmage.Table<any>
					createData: (params: xCreateParams) => Partial<xResource>
					updateData: (params: xUpdateParams) => Partial<xResource>
					createHook?: (resource: xResource) => Promise<void>
					updateHook?: (resource: xResource) => Promise<void>
				}) {
				const context = prepMockResource<xResource>(table)
				return {
					create: context.create<xCreateParams>({
						makeData: createData,
						hook: createHook,
					}),
					retrieve: context.retrieve(),
					update: context.update<xUpdateParams>({
						makeData: updateData,
						hook: updateHook,
					}),
					delete: context.delete(),
				}
			}

			return {

				customers: {
					...mockResource<
							Stripe.Customer,
							Stripe.CustomerCreateParams,
							Stripe.CustomerUpdateParams
						>({
						table: tables.customers,
						createData: params => ({
							email: params.email,
							invoice_settings: <any>params.invoice_settings
								?? {default_payment_method: undefined},
						}),
						updateData: params => ({
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

				products: mockResource<
						Stripe.Product,
						Stripe.ProductCreateParams,
						Stripe.ProductUpdateParams
					>({
					table: tables.products,
					createData: params => ({
						name: params.name,
						description: params.description,
						active: true,
					}),
					updateData: params => ({
						name: params.name,
						active: params.active,
						description: params.description,
					}),
				}),

				prices: mockResource<
						Stripe.Price,
						Stripe.PriceCreateParams,
						Stripe.PriceUpdateParams
					>({
					table: tables.prices,
					createData: params => ({
						active: params.active === undefined ?true :params.active,
						product: params.product,
						currency: params.currency,
						unit_amount: params.unit_amount,
						recurring: <any>params.recurring,
						type: params.recurring ?"recurring" :"one_time",
					}),
					updateData: params => ({
						active: params.active,
					}),
				}),

				checkout: {
					sessions: mockResource<
							Stripe.Checkout.Session,
							Stripe.Checkout.SessionCreateParams,
							Stripe.Checkout.Session
						>({
						table: tables.checkoutSessions,
						createData: params => ({
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
						updateData: params => ({}),
					}),
				},

				paymentMethods: (() => {
					const resource = mockResource<
							Stripe.PaymentMethod,
							Stripe.PaymentMethodCreateParams,
							Stripe.PaymentMethodUpdateParams
						>({
						table: tables.paymentMethods,
						createData: params => ({
							type: params.type,
							customer: params.customer,
							card: <any>params.card,
						}),
						updateData: params => ({
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

				setupIntents: mockResource<
						Stripe.SetupIntent,
						Stripe.SetupIntentCreateParams,
						Stripe.SetupIntentUpdateParams
					>({
					table: tables.setupIntents,
					createData: params => ({
						customer: params.customer,
						payment_method: params.payment_method,
						usage: params.usage,
					}),
					updateData: params => ({
						payment_method: params.payment_method,
					}),
				}),

				paymentIntents: mockResource<
						Stripe.PaymentIntent,
						Stripe.PaymentIntentCreateParams,
						Stripe.PaymentIntentUpdateParams
					>({
					table: tables.setupIntents,
					createData: params => ({
						customer: params.customer,
						payment_method: params.payment_method,
						amount: params.amount,
						currency: params.currency,
					}),
					updateData: params => ({
						customer: params.customer,
						payment_method: params.payment_method,
						amount: params.amount,
						currency: params.currency,
					}),
				}),

				subscriptions: (() => {
					const resource = mockResource<
							Stripe.Subscription,
							Stripe.SubscriptionCreateParams,
							Stripe.SubscriptionUpdateParams
						>({
						table: tables.subscriptions,
						createData: params => ({
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
						updateData: params => ({
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
