
import {find} from "dbmage"

import {Rando} from "dbmage"
import {StripeWebhooks} from "./types/stripe-webhooks.js"
import {pubsub, pubsubs} from "../../../toolbox/pubsub.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {mockStripeLiaison} from "./mocks/mock-stripe-liaison.js"
import {mockStripeTables} from "./mocks/tables/mock-stripe-tables.js"
import {DatabaseRaw} from "../../../assembly/backend/types/database.js"
import {FlexStorage} from "dbmage"

export async function mockStripeCircuit({
		rando, tableStorage, databaseRaw,
	}: {
		rando: Rando
		databaseRaw: DatabaseRaw
		tableStorage: FlexStorage
	}) {

	const {
		publishers: webhookPublishers,
		subscribers: webhookSubscribers,
	} = pubsubs<StripeWebhooks>({
		"checkout.session.completed": pubsub(),
		"invoice.paid": pubsub(),
		"invoice.payment_failed": pubsub(),
		"customer.subscription.updated": pubsub(),
	})

	const stripeTables = await mockStripeTables({tableStorage})

	const stripeLiaison = mockStripeLiaison({
		rando,
		tables: stripeTables,
		webhooks: webhookPublishers,
	})

	const webhooks = stripeWebhooks({
		databaseRaw,
		stripeLiaison,
		logger: console,
	})

	for (const [key, subscribe] of Object.entries(webhookSubscribers))
		subscribe(webhooks[key].bind(webhooks))

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
			// async purchaseSubscription(stripeAccountId: string) {},
		},
	}
}
