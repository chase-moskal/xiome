
import Stripe from "stripe"

import {MockStripeOperations} from "./types.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {StoreDatabaseRaw} from "../database/types/schema.js"
import {makeStripeLiaison} from "./liaison/stripe-liaison.js"
import {Logger} from "../../../../toolbox/logger/interfaces.js"
import {ConfigStripe} from "../../../../assembly/backend/types/config-stripe.js"
import {PrepareRoleManager} from "../../../auth/aspects/permissions/interactions/types.js"

export function realStripeCircuit({
		logger, storeDatabaseRaw, stripeConfig,
		prepareRoleManager,
	}: {
		logger: Logger
		stripeConfig: ConfigStripe
		storeDatabaseRaw: StoreDatabaseRaw
		prepareRoleManager: PrepareRoleManager
	}) {

	const stripe = new Stripe(
		stripeConfig.keys.secret,
		{apiVersion: "2022-11-15"},
	)

	const stripeLiaison = makeStripeLiaison({stripe})

	return {
		stripe,
		stripeLiaison,
		stripeWebhooks: stripeWebhooks({
			logger,
			stripeLiaison,
			storeDatabaseRaw,
			prepareRoleManager,
		}),
		mockStripeOperations: <MockStripeOperations>undefined,
	}
}
