
import {find} from "dbmage"
import {Rando} from "dbmage"
import {Stripe} from "stripe"
import {FlexStorage} from "dbmage"

import {StripeWebhooks} from "./types/stripe-webhooks.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
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

	const stripeLiaison = mockStripeLiaison({
		rando,
		tables: stripeTables,
	})

	const webhooks = stripeWebhooks({
		logger,
		databaseRaw,
		stripeLiaison,
	})

	async function webhookEvent<xObject extends {}>(
			type: keyof StripeWebhooks,
			stripeAccountId: string,
			object: xObject,
		) {
		return webhooks[type](<Stripe.Event>{
			type,
			account: stripeAccountId,
			data: <Stripe.Event.Data>{object},
		})
	}

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
				const session = await stripeTables.checkoutSessions.readOne(find({
					id: stripeSessionId,
				}))
				const customer = <string>session.customer
				await stripeTables.paymentMethods.delete(find({customer}))
				const paymentMethod = await stripeLiaisonAccount.paymentMethods.create({
					customer,
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
					mode: "setup",
					setup_intent: setupIntent.id,
					client_reference_id: session.client_reference_id,
				})
			},
		},
	}
}
