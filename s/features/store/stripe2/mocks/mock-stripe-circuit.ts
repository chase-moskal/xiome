
import {stripeWebhooks} from "../stripe-webhooks.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeWebhooks} from "../types/stripe-webhooks.js"
import {mockStripeLiaison} from "./mock-stripe-liaison.js"
import {pubsub, pubsubs} from "../../../../toolbox/pubsub.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {mockStripeTables} from "./tables/mock-stripe-tables.js"
import {StoreTables} from "../../api/tables/types/store-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"

export async function mockStripeCircuit({
		rando, tableStorage, tables: xiomeTables,
	}: {
		rando: Rando
		tableStorage: FlexStorage
		tables: StoreTables & AuthTables
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

	const liaison = mockStripeLiaison({
		rando,
		tables: stripeTables,
		webhooks: webhookPublishers,
	})

	const webhooks = stripeWebhooks({
		liaison,
		logger: console,
		tables: xiomeTables,
	})

	for (const [key, subscribe] of Object.entries(webhookSubscribers))
		subscribe(webhooks[key].bind(webhooks))

	return {
		liaison,
		mockStripeOperations: {
			linkBankWithExistingStripeAccount: async(stripeAccountId: string) => {
				await stripeTables.accounts.update({
					...find({id: stripeAccountId}),
					write: {
						payouts_enabled: true,
						details_submitted: true,
					},
				})
			},
		},
	}
}
