
import {DatabaseFinal} from "../types/database.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStripeCircuit} from "../../../features/store/stripe/mock-stripe-circuit.js"

export async function assimilateStripe({
		database, mockStorage,
		config, rando,
	}: {
		database: DatabaseFinal
		mockStorage: FlexStorage
	} & AssimilatorOptions) {

	if (config.stripe === "mock-mode") {
		return mockStripeCircuit({
			rando,
			tableStorage: mockStorage,
			database: database.subsection(tables => ({
				auth: tables.auth,
				store: tables.store,
			})),
		})
	}
	else {
		throw new Error("real stripe not implemented")
	}
}
