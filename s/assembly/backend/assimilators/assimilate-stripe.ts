
import {DatabaseFinal} from "../types/database.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStripeCircuit} from "../../../features/store/stripe/mocks/mock-stripe-circuit.js"

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
			authTables: database.auth,
			storeTables: database.store,
		})
	}
	else {
		throw new Error("real stripe not implemented")
	}
}
