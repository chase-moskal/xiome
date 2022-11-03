
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {StoreDatabaseRaw} from "../database/types/schema.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {MockStripeRecentDetails, StripeWebhooks} from "./types.js"
import {mockStripeLiaison} from "./liaison/mock/mock-stripe-liaison.js"
import {mockStripeTables} from "./liaison/mock/tables/mock-stripe-tables.js"
import {makeMetaDataTables} from "./liaison/mock/tables/make-meta-data-tables.js"
import {prepareMockStripeOperations} from "./utils/prepare-mock-stripe-operations.js"
import {PrepareRoleManager} from "../../../auth/aspects/permissions/interactions/types.js"
import {prepareWebhookDispatcherWithAntiCircularity} from "./utils/prepare-webhook-dispatcher-with-anti-circularity.js"

export async function mockStripeCircuit({
		logger, webRoot, rando, tableStorage, storeDatabaseRaw,
		prepareRoleManager,
	}: {
		logger: Logger
		webRoot: string
		rando: dbmage.Rando
		tableStorage: dbmage.FlexStorage
		storeDatabaseRaw: StoreDatabaseRaw
		prepareRoleManager: PrepareRoleManager
	}) {

	const stripeTables = await mockStripeTables({tableStorage})
	const metaDataTables = await makeMetaDataTables({tableStorage})
	const recentDetails = <MockStripeRecentDetails>{}

	const pointer = {webhooks: undefined as StripeWebhooks | undefined}
	const dispatchWebhook = prepareWebhookDispatcherWithAntiCircularity(pointer)

	const stripeLiaison = mockStripeLiaison({
		rando,
		rootUrl: webRoot,
		recentDetails,
		metaDataTables,
		tables: stripeTables,
		dispatchWebhook,
	})

	pointer.webhooks = stripeWebhooks({
		logger,
		stripeLiaison,
		storeDatabaseRaw,
		prepareRoleManager,
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
		stripeWebhooks: pointer.webhooks,
		mockStripeOperations,
	}
}
