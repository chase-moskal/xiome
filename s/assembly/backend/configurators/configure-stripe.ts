
import {SecretConfig} from "../types/secret-config.js"
import {ConfigStripe} from "../types/config-stripe.js"
import {StoreDatabaseRaw} from "../../../features/store2/types/store-schema.js"
import {realStripeCircuit} from "../../../features/store2/stripe/real-stripe-circuit.js"
import {PreparePermissionsInteractions} from "../../../features/store2/interactions/interactions-types.js"

export async function configureStripe({
		config,
		storeDatabaseRaw,
		preparePermissionsInteractions,
	}: {
		config: SecretConfig
		storeDatabaseRaw: StoreDatabaseRaw
		preparePermissionsInteractions: PreparePermissionsInteractions
	}) {

	return realStripeCircuit({
		logger: console,
		storeDatabaseRaw,
		preparePermissionsInteractions,
		stripeConfig: <ConfigStripe>config.stripe,
	})
}
