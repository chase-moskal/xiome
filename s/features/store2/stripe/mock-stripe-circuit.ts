
import * as dbmage from "dbmage"

import {StoreDatabaseRaw} from "../types/store-schema.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {MockStripeRecentDetails, StripeWebhooks} from "./types.js"
import {mockStripeLiaison} from "./liaison/mock/mock-stripe-liaison.js"
import {mockStripeTables} from "./liaison/mock/tables/mock-stripe-tables.js"
import {prepareMockStripeOperations} from "./utils/prepare-mock-stripe-operations.js"
import {mockPermissionsInteractions} from "../interactions/mock-permissions-interactions.js"
import {prepareWebhookDispatcherWithAntiCircularity} from "./utils/prepare-webhook-dispatcher-with-anti-circularity.js"

export async function mockStripeCircuit({
		rando, logger, tableStorage, storeDatabaseRaw,
	}: {
		rando: dbmage.Rando
		logger: Logger
		tableStorage: dbmage.FlexStorage
		storeDatabaseRaw: StoreDatabaseRaw
	}) {

	const stripeTables = await mockStripeTables({tableStorage})
	const recentDetails = <MockStripeRecentDetails>{}
	const mockPermissions = mockPermissionsInteractions()

	const pointer = {webhooks: undefined as StripeWebhooks | undefined}
	const dispatchWebhook = prepareWebhookDispatcherWithAntiCircularity(pointer)

	const stripeLiaison = mockStripeLiaison({
		rando,
		recentDetails,
		tables: stripeTables,
		dispatchWebhook,
	})

	pointer.webhooks = stripeWebhooks({
		logger,
		stripeLiaison,
		storeDatabaseRaw,
		permissionsInteractions: mockPermissions.permissionsInteractions,
	})

	return {
		stripeLiaison,
		mockPermissions,
		mockStripeOperations: prepareMockStripeOperations({
			rando,
			stripeTables,
			stripeLiaison,
			recentDetails,
			dispatchWebhook,
		}),
	}
}
