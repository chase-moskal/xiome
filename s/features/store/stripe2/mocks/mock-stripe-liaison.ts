
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeLiaison} from "../types/stripe-liaison.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"
import {mockLiaisonUtils} from "./utils/mock-liaison-utils.js"
import {MockStripeTables} from "./tables/types/mock-stripe-tables.js"
import {StripeLiaisonPlatform} from "../types/stripe-liaison-platform.js"
import {StripeLiaisonConnected} from "../types/stripe-liaison-connected.js"
import {prepareConstrainTables} from "../../../../toolbox/dbby/dbby-constrain.js"
import {toPaymentDetails} from "../../stripe/parts/subscriptions/helpers/to-payment-details.js"
import {toSubscriptionDetails} from "../../stripe/parts/subscriptions/helpers/to-subscription-details.js"

export function mockStripeLiaison({rando, webhooks, mockStripeTables}: {
		rando: Rando
		webhooks: StripeWebhooks
		mockStripeTables: MockStripeTables
	}): StripeLiaison {

	const utils = mockLiaisonUtils({rando, tables: mockStripeTables})
	const platform: StripeLiaisonPlatform = {
		accounting: {
			async getStripeAccount(id: string) {
				return utils.procedures.fetchAccount(id)
			},
			async createStripeAccount() {
				const account = await utils.initializers.account()
				return {stripeAccountId: account.id}
			},
			async createAccountOnboardingLink() {
				throw new Error("TODO implement mock onboarding")
				return {stripeAccountSetupLink: ""}
			},
			async createAccountUpdateLink() {
				throw new Error("TODO implement mock update")
				return {stripeAccountSetupLink: ""}
			},
		},
	}

	function connect(stripeConnectAccountId: string): StripeLiaisonConnected {
		const utils = mockLiaisonUtils({
			rando,
			tables: prepareConstrainTables(mockStripeTables)({
				"_connectedAccount": stripeConnectAccountId,
			})
		})
		return {
			customers: {
				async createCustomer() {
					const customer = await utils.initializers.customer()
					return {stripeCustomerId: customer.id}
				},
				async fetchPaymentDetails(stripePaymentMethodId) {
					const paymentMethod =
						await utils.procedures.fetchPaymentMethod(stripePaymentMethodId)
					return toPaymentDetails(paymentMethod)
				},
				async fetchPaymentDetailsByIntentId(stripeIntentId) {
					const intent =
						await utils.procedures.fetchSetupIntent(stripeIntentId)
					const paymentMethod =
						await utils.procedures.fetchPaymentMethod(intent.payment_method)
					return toPaymentDetails(paymentMethod)
				},
				async fetchPaymentDetailsBySubscriptionId(stripeSubscriptionId) {
					const subscription =
						await utils.procedures.fetchSubscription(stripeSubscriptionId)
					const paymentMethod =
						await utils.procedures
							.fetchPaymentMethod(subscription.default_payment_method)
					return toPaymentDetails(paymentMethod)
				},
				async updateDefaultPaymentMethod({
						stripeCustomerId,
						stripePaymentMethodId,
					}) {
					await utils.procedures.updateCustomer(stripeCustomerId, {
						invoice_settings: {
							default_payment_method: stripePaymentMethodId,
							custom_fields: [],
							footer: "",
						},
					})
				},
			},
			checkouts: {
				async purchaseSubscriptions({
						userId, stripeCustomerId, stripePriceIds,
					}) {
					const customer
						= await utils.procedures.fetchCustomer(stripeCustomerId)
					const paymentMethod
						= await utils.initializers.paymentMethod()
					const subscription
						= await utils.initializers.subscription({})
					// const paymentMethod
					// 	= await utils.initializers.sessionForSubscriptionPurchase({
					// 		userId,
					// 		customer,
					// 		subscription,
					// 	})
				},
				async setupSubscription() {},
			},
			products: {},
			subscriptions: {
				async fetchSubscriptionDetails(stripeSubscriptionId: string) {
					const subscription = await utils.procedures.fetchSubscription(stripeSubscriptionId)
					return toSubscriptionDetails(subscription)
				},
			}
		}
	}

	return {platform, connect}
}
