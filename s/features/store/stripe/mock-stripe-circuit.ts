
import {find} from "dbmage"
import {Rando} from "dbmage"
import {Stripe} from "stripe"
import {FlexStorage} from "dbmage"

import {StripeWebhooks} from "./types/stripe-webhooks.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {getStripeId} from "./liaison/helpers/get-stripe-id.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {mockStripeTables} from "./mocks/tables/mock-stripe-tables.js"
import {DatabaseRaw} from "../../../assembly/backend/types/database.js"

export async function mockStripeCircuit({
		rando, logger, tableStorage, databaseRaw,
	}: {
		rando: Rando
		logger: Logger
		databaseRaw: DatabaseRaw
		tableStorage: FlexStorage
	}) {

	const stripeTables = await mockStripeTables({tableStorage})

	let webhookCircularity: undefined | string

	async function webhookEvent<xObject extends {}>(
			type: keyof StripeWebhooks,
			stripeAccountId: string,
			object: xObject,
		) {
		if (webhookCircularity)
			throw new Error(`webhook circularity error "${webhookCircularity}" -> "${type}"`)
		webhookCircularity = type
		const result = await webhooks[type](<Stripe.Event>{
			type,
			account: stripeAccountId,
			data: <Stripe.Event.Data>{object},
		})
		webhookCircularity = undefined
		return result
	}

	const stripeLiaison = mockStripeLiaison({
		rando,
		webhookEvent,
		tables: stripeTables,
	})

	const webhooks = stripeWebhooks({
		logger,
		databaseRaw,
		stripeLiaison,
	})

	return {
		stripeLiaison,
		mockStripeOperations: {
			async linkStripeAccount(stripeAccountId: string) {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: {
						email: "fake-stripe-account-email@xiome.io",
						charges_enabled: true,
						payouts_enabled: true,
						details_submitted: true,
					},
				})
			},
			async linkStripeAccountThatIsIncomplete(stripeAccountId: string) {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: {
						charges_enabled: false,
						payouts_enabled: false,
						details_submitted: false,
					},
				})
			},
			async configureStripeAccount(stripeAccountId: string, completed: boolean) {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: completed
						? {
							charges_enabled: true,
							payouts_enabled: true,
							details_submitted: true,
						}
						: {
							charges_enabled: false,
							payouts_enabled: false,
							details_submitted: false,
						},
				})
			},
			async updatePaymentMethod(stripeAccountId: string, stripeSessionId: string) {
				const stripeLiaisonAccount = stripeLiaison.account(stripeAccountId)
				const session = await stripeTables
					.checkoutSessions.readOne(find({id: stripeSessionId}))
				const customer = <string>session.customer
				await stripeTables.paymentMethods.delete(find({customer}))
				const paymentMethod = await stripeLiaisonAccount.paymentMethods.create({
					customer,
					type: "card",
					card: <any>{
						brand: "fakevisa",
						country: "canada",
						exp_month: 1,
						exp_year: 2032,
						last4: rando.randomSequence(4, [..."0123456789"]),
					},
				})
				const setupIntent = await stripeLiaisonAccount.setupIntents.create({
					payment_method: paymentMethod.id,
				})
				await webhookEvent("checkout.session.completed", stripeAccountId, {
					customer,
					mode: "setup",
					setup_intent: setupIntent.id,
					client_reference_id: session.client_reference_id,
				})
			},
			async checkoutSubscriptionTier(stripeAccountId: string, stripeSessionId: string) {
				const session = await stripeTables
					.checkoutSessions.readOne(find({id: stripeSessionId}))
				await webhookEvent("checkout.session.completed", stripeAccountId, {
					customer: session.customer,
					mode: "setup",
					setup_intent: getStripeId(session.setup_intent),
					client_reference_id: session.client_reference_id,
				})
			},
		},
	}
}
