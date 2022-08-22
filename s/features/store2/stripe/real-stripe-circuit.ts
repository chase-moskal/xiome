
import Stripe from "stripe"

import {MockStripeOperations} from "./types.js"
import {StoreDatabaseRaw} from "../types/store-schema.js"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {Logger} from "../../../toolbox/logger/interfaces.js"
import {makeStripeLiaison} from "./liaison/stripe-liaison.js"
import {makeStripePopups} from "../popups/make-stripe-popups.js"
import {ConfigStripe} from "../../../assembly/backend/types/config-stripe.js"
import {PreparePermissionsInteractions} from "../interactions/interactions-types.js"

export function realStripeCircuit({
		logger, storeDatabaseRaw, stripeConfig,
		preparePermissionsInteractions,
	}: {
		logger: Logger
		stripeConfig: ConfigStripe
		storeDatabaseRaw: StoreDatabaseRaw
		preparePermissionsInteractions: PreparePermissionsInteractions
	}) {

	const stripe = new Stripe(
		stripeConfig.keys.secret,
		{apiVersion: "2022-08-01"},
	)

	const stripeLiaison = makeStripeLiaison({stripe})

	return {
		stripe,
		stripeLiaison,
		stripePopups: makeStripePopups(),
		stripeWebhooks: stripeWebhooks({
			logger,
			stripeLiaison,
			storeDatabaseRaw,
			preparePermissionsInteractions,
		}),
		mockStripeOperations: <MockStripeOperations>undefined,
	}
}
