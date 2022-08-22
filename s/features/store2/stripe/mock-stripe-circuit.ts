
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {StoreDatabaseRaw} from "../types/store-schema.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {mockStripePopups} from "../popups/mock-stripe-popups.js"
import {MockStripeRecentDetails, StripeWebhooks} from "./types.js"
import {mockStripeLiaison} from "./liaison/mock/mock-stripe-liaison.js"
import {mockStripeTables} from "./liaison/mock/tables/mock-stripe-tables.js"
import {makeMetaDataTables} from "./liaison/mock/tables/make-meta-data-tables.js"
import {PreparePermissionsInteractions} from "../interactions/interactions-types.js"
import {prepareMockStripeOperations} from "./utils/prepare-mock-stripe-operations.js"
import {prepareWebhookDispatcherWithAntiCircularity} from "./utils/prepare-webhook-dispatcher-with-anti-circularity.js"

export async function mockStripeCircuit({
		logger, rando, tableStorage, storeDatabaseRaw,
		preparePermissionsInteractions,
	}: {
		logger: Logger
		rando: dbmage.Rando
		tableStorage: dbmage.FlexStorage
		storeDatabaseRaw: StoreDatabaseRaw
		preparePermissionsInteractions: PreparePermissionsInteractions
	}) {

	const stripeTables = await mockStripeTables({tableStorage})
	const metaDataTables = await makeMetaDataTables({tableStorage})
	const recentDetails = <MockStripeRecentDetails>{}

	const pointer = {webhooks: undefined as StripeWebhooks | undefined}
	const dispatchWebhook = prepareWebhookDispatcherWithAntiCircularity(pointer)

	const stripeLiaison = mockStripeLiaison({
		rando,
		recentDetails,
		metaDataTables,
		tables: stripeTables,
		dispatchWebhook,
	})

	pointer.webhooks = stripeWebhooks({
		logger,
		stripeLiaison,
		storeDatabaseRaw,
		preparePermissionsInteractions,
	})

	const mockStripeOperations = prepareMockStripeOperations({
		rando,
		stripeTables,
		metaDataTables,
		stripeLiaison,
		recentDetails,
		dispatchWebhook,
	})

	return {
		stripe: <Stripe>undefined,
		stripeLiaison,
		stripePopups: mockStripePopups({mockStripeOperations}),
		stripeWebhooks: pointer.webhooks,
		mockStripeOperations,
	}
}
