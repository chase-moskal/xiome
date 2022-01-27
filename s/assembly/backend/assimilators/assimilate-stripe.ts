
import {DatabaseRaw} from "../types/database.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {FlexStorage} from "dbmage"
import {mockStripeCircuit} from "../../../features/store/stripe/mock-stripe-circuit.js"

export async function assimilateStripe({
		databaseRaw, mockStorage,
		config, rando,
	}: {
		databaseRaw: DatabaseRaw
		mockStorage: FlexStorage
	} & AssimilatorOptions) {

	if (config.stripe === "mock-mode") {
		return mockStripeCircuit({
			rando,
			databaseRaw,
			tableStorage: mockStorage,
		})
	}
	else {
		throw new Error("real stripe not implemented")
	}
}
