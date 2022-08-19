
import {SecretConfig} from "../types/secret-config.js"
import {StoreDatabaseRaw} from "../../../features/store2/types/store-schema.js"
import {PreparePermissionsInteractions} from "../../../features/store2/interactions/interactions-types.js"
import {realStripeCircuit} from "../../../features/store2/stripe/real-stripe-circuit.js"
import {ConfigStripe} from "../types/config-stripe.js"

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
		stripeConfig: <ConfigStripe>config.stripe,
		preparePermissionsInteractions,
	})
}
