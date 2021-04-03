
import {Stripe} from "stripe"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeComplex} from "../types/stripe-complex.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"
import {StripeLiaisonForApp} from "../types/stripe-liaison-app.js"
import {MockStripeTables} from "./tables/types/mock-stripe-tables.js"
import {StripeLiaisonForPlatform} from "../types/stripe-liaison-for-platform.js"
import {prepareConstrainTables} from "../../../../toolbox/dbby/dbby-constrain.js"

export function mockStripeComplex({rando, tables, webhooks}: {
		rando: Rando
		tables: MockStripeTables
		webhooks: StripeWebhooks
	}): StripeComplex {

	const generateId = () => rando.randomId()
	function respond<xResource>(resource: xResource): Stripe.Response<xResource> {
		return {
			headers: {},
			lastResponse: undefined,
			...resource,
		}
	}

	const stripeLiaisonForPlatform: StripeLiaisonForPlatform = {
		accounts: {
			async create(params) {
				const account: Partial<Stripe.Account> = {
					id: generateId(),
					type: params.type,
					email: params.email,
				}
				await tables.accounts.create(account)
				return respond(<Stripe.Account>account)
			},
			async retrieve(id) {
				const account = await tables.accounts.one(find({id}))
				return respond(<Stripe.Account>account)
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
	}

	async function webhookEvent<xObject extends {}>(
			type: keyof StripeWebhooks,
			object: xObject,
		) {
		return webhooks[type](<Stripe.Event>{
			type,
			data: <Stripe.Event.Data>{object},
		})
	}

	const rawTables = tables
	function connectStripeLiaisonForApp(stripeConnectAccountId: string): StripeLiaisonForApp {
		const tables = prepareConstrainTables(rawTables)({
			"_connectedAccount": stripeConnectAccountId,
		})

		function ignoreUndefined<X extends {}>(input: X): X {
			const output = {}
			for (const [key, value] of Object.entries(input)) {
				if (value !== undefined)
					output[key] = value
			}
			return <X>output
		}

		function prepMockResource<xResource>(table: DbbyTable<any>) {
			return {
				create<xParams>({makeData, hook = async() => {}}: {
						makeData: (params: xParams) => Partial<xResource>
						hook?: (resource: xResource) => Promise<void>
					}) {
					return async function(params: xParams) {
						const resource = <Partial<xResource>><any>{
							id: generateId(),
							...makeData(params),
						}
						await table.create(resource)
						await hook(<xResource>resource)
						return respond(<xResource>resource)
					}
				},
				retrieve() {
					return async function(id: string) {
						const resource = await table.one(find({id}))
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
						const resource = await table.one(find({id}))
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
				table: DbbyTable<any>
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

			customers: mockResource<
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

			products: mockResource<
					Stripe.Product,
					Stripe.ProductCreateParams,
					Stripe.ProductUpdateParams
				>({
				table: tables.products,
				createData: params => ({
					name: params.name,
					description: params.description,
				}),
				updateData: params => ({
					name: params.name,
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
					product: params.product,
					currency: params.currency,
					unit_amount: params.unit_amount,
					recurring: <any>params.recurring,
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
						customer: params.customer,
					}),
					updateData: params => ({}),
					createHook: async session => {
						await webhookEvent("checkout.session.completed", session)
					},
					updateHook: async session => {
						await webhookEvent("checkout.session.completed", session)
					},
				}),
			},

			paymentMethods: mockResource<
					Stripe.PaymentMethod,
					Stripe.PaymentMethodCreateParams,
					Stripe.PaymentMethodUpdateParams
				>({
				table: tables.paymentMethods,
				createData: params => ({
					type: params.type,
					customer: params.customer,
				}),
				updateData: params => ({}),
			}),

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

			subscriptions: mockResource<
					Stripe.Subscription,
					Stripe.SubscriptionCreateParams,
					Stripe.SubscriptionUpdateParams
				>({
				table: tables.subscriptions,
				createData: params => ({
					customer: params.customer,
					default_payment_method: params.default_payment_method,
					cancel_at_period_end: params.cancel_at_period_end,
					items: {
						url: "",
						object: "list",
						has_more: false,
						data: <any>params.items.map(itemParams => ({
							id: generateId(),
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
				updateHook: async subscription => {
					await webhookEvent("customer.subscription.updated", subscription)
				},
			}),
		}
	}

	return {stripeLiaisonForPlatform, connectStripeLiaisonForApp}
}
