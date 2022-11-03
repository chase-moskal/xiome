
import Stripe from "stripe"
import * as dbmage from "dbmage"
import {find, Rando} from "dbmage"

import {StripeLiaison} from "../types.js"
import {getStripeId} from "../../utils/get-stripe-id.js"
import {stripeResponse} from "./utils/stripe-response.js"
import {DispatchWebhook, MockStripeRecentDetails} from "../../types.js"
import {prepareStandardRestResource} from "./utils/standard-rest-resource.js"
import {MockStripeTables, MockAccount, MetaDataTables} from "./tables/types.js"
import {mockSubscriptionMechanics} from "./utils/mock-subscription-mechanics.js"
import {makeFakestripePopupUrls} from "../../../../popups/make-fakestripe-popup-urls.js"

export function mockStripeLiaison({
		rando,
		rootUrl,
		recentDetails,
		metaDataTables,
		tables: rawTables,
		dispatchWebhook,
	}: {
		rando: Rando
		rootUrl: string
		tables: MockStripeTables
		metaDataTables: MetaDataTables
		recentDetails: MockStripeRecentDetails
		dispatchWebhook: DispatchWebhook
	}): StripeLiaison {

	const generateId = () => rando.randomId().string
	const makeStandardRestResource = prepareStandardRestResource({generateId})
	const fakestripePopups = makeFakestripePopupUrls(rootUrl)

	return {

		accounts: {
			async create(params) {
				const account: Partial<Stripe.Account> = {
					id: generateId().toString(),
					type: params.type,
					email: params.email,
				}
				await rawTables.accounts.create(<MockAccount>account)
				return stripeResponse(<Stripe.Account>account)
			},
			async retrieve(id) {
				const account = await rawTables.accounts.readOne(find({id}))
				return stripeResponse(<Stripe.Account>account)
			},
			async createLoginLink(id) {
				const loginLink: Partial<Stripe.LoginLink> = {
					created: Date.now(),
					url: fakestripePopups.login(),
				}
				return stripeResponse(<Stripe.LoginLink>loginLink)
			},
		},

		accountLinks: {
			async create(params) {
				const accountLink: Partial<Stripe.AccountLink> = {
					url: fakestripePopups.connect({
						return_url: params.return_url!,
						refresh_url: params.refresh_url!,
					}),
				}
				return stripeResponse(<Stripe.AccountLink>accountLink)
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

			return {

				billingPortal: {
					async create(params: Stripe.BillingPortal.SessionCreateParams) {
						return stripeResponse(<Stripe.BillingPortal.Session>{
							url: fakestripePopups.customerPortal(),
							customer: params.customer
						})
					}
				},

				customers: {
					...makeStandardRestResource<Stripe.Customer>()({
						table: tables.customers,
						handleCreate: async(params: Stripe.CustomerCreateParams) => ({
							resource: {
								email: params.email,
								invoice_settings: <any>params.invoice_settings
									?? {default_payment_method: undefined},
							}
						}),
						handleUpdate: async(id, params: Stripe.CustomerUpdateParams) => ({
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
						return stripeResponse({
							object: "list",
							data: paymentMethods,
						})
					},
				},

				products: makeStandardRestResource<Stripe.Product>()({
					table: tables.products,
					handleCreate: async(params: Stripe.ProductCreateParams) => ({
						resource: {
							name: params.name,
							description: params.description,
							active: true,
						}
					}),
					handleUpdate: async(id, params: Stripe.ProductUpdateParams) => ({
						name: params.name,
						active: params.active,
						description: params.description,
						default_price: params.default_price,
					}),
				}),

				prices: (() => {
					const resource = makeStandardRestResource<Stripe.Price>()({
						table: tables.prices,
						handleCreate: async(params: Stripe.PriceCreateParams) => ({
							resource: {
								active: params.active === undefined ?true :params.active,
								product: params.product,
								currency: params.currency,
								unit_amount: params.unit_amount,
								recurring: params.recurring
									? <any>{usage_type: "licensed", ...params.recurring}
									: undefined,
								type: params.recurring ?"recurring" :"one_time",
							}
						}),
						handleUpdate: async(id, params: Stripe.PriceUpdateParams) => ({
							active: params.active,
							recurring: params.recurring
								? <any>{usage_type: "licensed", ...params.recurring}
								: undefined,
						}),
					})
					return {
						...resource,
						async list(params: Stripe.PriceListParams) {
							let prices = await tables.prices.read({conditions: false})
							if (params.active !== undefined)
								prices = prices.filter(p => p.active === params.active)
							if (params.product !== undefined)
								prices = prices.filter(p => p.product === params.product)
							return stripeResponse({
								object: "list",
								data: prices,
							})
						},
					}
				})(),

				checkout: {
					sessions: makeStandardRestResource<Stripe.Checkout.Session>()({
						table: tables.checkoutSessions,
						handleCreate: async(params: Stripe.Checkout.SessionCreateParams) => ({
							resource: {
								mode: params.mode,
								url: params.mode === "setup"
									? undefined
									: fakestripePopups.checkout({
										cancel_url: params.cancel_url!,
										success_url: params.success_url!,
									}),
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
							}
						}),
						handleUpdate: async(id, params: Stripe.Checkout.Session) => ({}),
					}),
				},

				paymentMethods: (() => {
					const resource = makeStandardRestResource<Stripe.PaymentMethod>()({
						table: tables.paymentMethods,
						handleCreate: async(params: Stripe.PaymentMethodCreateParams) => ({
							resource: {
								type: params.type,
								customer: params.customer,
								card: <any>params.card,
							}
						}),
						handleUpdate: async(id, params: Stripe.PaymentMethodUpdateParams) => ({
							card: <any>params.card,
						}),
					})
					return {
						...resource,
						delete: undefined,
						async detach(id: string) {
							const paymentMethod = resource.retrieve(id)
							await resource.del(id)
							return stripeResponse(paymentMethod)
						}
					}
				})(),

				setupIntents: makeStandardRestResource<Stripe.SetupIntent>()({
					table: tables.setupIntents,
					handleCreate: async(params: Stripe.SetupIntentCreateParams) => ({
						resource: {
							customer: params.customer,
							payment_method: params.payment_method,
							usage: params.usage,
						}
					}),
					handleUpdate: async(id, params: Stripe.SetupIntentUpdateParams) => ({
						payment_method: params.payment_method,
					}),
				}),

				paymentIntents: makeStandardRestResource<Stripe.PaymentIntent>()({
					table: tables.setupIntents,
					handleCreate: async(params: Stripe.PaymentIntentCreateParams) => ({
						resource: {
							customer: params.customer,
							payment_method: params.payment_method,
							amount: params.amount,
							currency: params.currency,
						}
					}),
					handleUpdate: async(id, params: Stripe.PaymentIntentUpdateParams) => ({
						customer: params.customer,
						payment_method: params.payment_method,
						amount: params.amount,
						currency: params.currency,
					}),
				}),

				subscriptionItems: makeStandardRestResource<Stripe.Subscription>(),

				subscriptions: (() => {
					const resource = makeStandardRestResource<Stripe.Subscription>()({
						table: tables.subscriptions,
						handleCreate: async(params: Stripe.SubscriptionCreateParams) => {
							const subscription = await subscriptionMechanics
								.interpretCreateParams(params)
							const {invoice, paymentIntent} = await subscriptionMechanics
								.generateInvoiceForSubscriptionItems({
									customer: <string>subscription.customer,
									default_payment_method: <string>subscription
										.default_payment_method,
									subscriptionId: subscription.id,
									items: subscription.items,
									current_period_end: subscription.current_period_end,
									current_period_start: subscription.current_period_start
								})
							const paymentMethodId = getStripeId(paymentIntent.payment_method)
							const paymentMethodMetaData = await metaDataTables.
								paymentMethodMetaData.readOne(find({id: paymentMethodId}))
							recentDetails.subscriptionCreation = {
								subscription,
								paymentIntent: <Stripe.PaymentIntent>paymentIntent,
							}
							subscription.status = paymentMethodMetaData?.isFailing
								? "incomplete"
								: "active"
							return {
								resource: subscription,
								afterResourceIsAddedToTable: async () => {
									if(!paymentMethodMetaData?.isFailing) {
										await dispatchWebhook(
											"invoice.paid",
											stripeAccountId,
											invoice,
										)}
									// else {
									// 	await dispatchWebhook(
									// 		"invoice.payment_failed",
									// 		stripeAccountId,
									// 		invoice,
									// 	)}
								}
							}
						},
					})
					return {
						...resource,
						async update(id: string, params: Stripe.SubscriptionUpdateParams) {
							const existingSubscription = <Stripe.Subscription>await resource.retrieve(id)
							const write: Partial<Stripe.Subscription> = {}
							const paymentMethodMetaData = await metaDataTables.
								paymentMethodMetaData.readOne(find({id: params.default_payment_method}))
							if (params.cancel_at_period_end !== undefined) {
								write.cancel_at_period_end = params.cancel_at_period_end
							}
							if (params.default_payment_method !== undefined) {
								write.default_payment_method = params.default_payment_method
							}
							write.status = paymentMethodMetaData?.isFailing
								? "incomplete"
								: "active"
							if (params.items !== undefined) {
								const newItems = params.items
								const items = await subscriptionMechanics
									.interpretUpdateItemsParam(newItems)
								const {invoice} = await subscriptionMechanics.generateInvoiceForSubscriptionItems({
									customer: <string>existingSubscription.customer,
									default_payment_method: <string>existingSubscription
										.default_payment_method,
									subscriptionId: id,
									items,
									current_period_end: existingSubscription.current_period_end,
									current_period_start: existingSubscription.current_period_start
								})
								if(paymentMethodMetaData?.isFailing){
									// await dispatchWebhook(
									// 	"invoice.payment_failed",
									// 	stripeAccountId,
									// 	invoice,
									// )
								}
								else {
									await dispatchWebhook(
										"invoice.paid",
										stripeAccountId,
										invoice,
									)
								}
								write.items = items
							}
							await tables.subscriptions.update({
								...dbmage.find({id}),
								write: <any>write,
							})
							return resource.retrieve(id)
						},
						async list(params: Stripe.SubscriptionListParams) {
							let equalityQuery: any = {equal: {customer: params.customer}}
							let statusQuery: any = {notEqual: {status: "canceled"}}

							if (params.price)
								equalityQuery.equal.price = params.price

							if (params.status)
								statusQuery = params.status === "all"
									? {isSet: {status: true}}
									: params.status === "ended"
										? [
											"and",
											{notEqual: {status: "canceled"}},
											{notEqual: {status: "incomplete_expired"}},
										]
										: {equal: {status: params.status}}

							const subscriptions = await tables.subscriptions.read({
								conditions: [
									"and",
									equalityQuery,
									statusQuery,
								],
							})

							return stripeResponse({
								object: "list",
								data: subscriptions,
							})
						},
					}
				})(),
			}
		}
	}
}
