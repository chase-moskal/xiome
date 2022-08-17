
import * as dbmage from "dbmage"

import {DatabaseRaw} from "../types/database.js"
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {realStripeCircuit} from "../../../features/store2/stripe/real-stripe-circuit.js"
import {mockStripeCircuit} from "../../../features/store2/stripe/mock-stripe-circuit.js"
import {buildFunctionToPreparePermissionsInteractions} from "../../../features/store2/interactions/permissions-interactions.js"

export async function assimilateStripe({
		databaseRaw, mockStorage,
		config, rando,
	}: {
		databaseRaw: DatabaseRaw
		mockStorage: dbmage.FlexStorage
	} & AssimilatorOptions) {

	const logger = console

	const storeDatabaseRaw = dbmage.subsection(databaseRaw, tables => tables.store)
	const permissionsDatabaseRaw = dbmage.subsection(databaseRaw, tables => tables.auth.permissions)

	const preparePermissionsInteractions = (
		buildFunctionToPreparePermissionsInteractions({
			rando,
			permissionsDatabaseRaw,
		})
	)

	if (config.stripe === "mock-mode") {
		return mockStripeCircuit({
			rando,
			logger,
			tableStorage: mockStorage,
			storeDatabaseRaw,
			preparePermissionsInteractions,
		})
	}
	else {
		return realStripeCircuit({
			logger,
			storeDatabaseRaw,
			stripeConfig: config.stripe,
			preparePermissionsInteractions,
		})
	}
}
