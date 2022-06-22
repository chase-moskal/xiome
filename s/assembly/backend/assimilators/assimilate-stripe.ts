
import * as dbmage from "dbmage"
import {FlexStorage} from "dbmage"
import {DatabaseRaw} from "../types/database.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {mockStripeCircuit} from "../../../features/store2/stripe/mock-stripe-circuit.js"

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
			logger: console,
			tableStorage: mockStorage,
			storeDatabaseRaw: dbmage.subsection(databaseRaw, tables => tables.store),
		})
	}
	else {
		throw new Error("real stripe not implemented")
	}
}
