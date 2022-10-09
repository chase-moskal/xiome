
import {SecretConfig} from "../types/secret-config.js"
import {ConfigStripe} from "../types/config-stripe.js"
import {StoreDatabaseRaw} from "../../../features/store/backend/database/types/schema.js"
import {PrepareRoleManager} from "../../../features/auth/aspects/permissions/interactions/types.js"
import {realStripeCircuit} from "../../../features/store/backend/stripe/real-stripe-circuit.js"

export async function configureStripe({
		config,
		storeDatabaseRaw,
		prepareRoleManager,
	}: {
		config: SecretConfig
		storeDatabaseRaw: StoreDatabaseRaw
		prepareRoleManager: PrepareRoleManager
	}) {

	return realStripeCircuit({
		logger: console,
		storeDatabaseRaw,
		prepareRoleManager,
		stripeConfig: <ConfigStripe>config.stripe,
	})
}
