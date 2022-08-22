
import * as dbmage from "dbmage"

import {DatabaseRaw} from "../types/database.js"
import {SecretConfig} from "../types/secret-config.js"
import {mockStripeCircuit} from "../../../features/store2/stripe/mock-stripe-circuit.js"
import type {configureStripe as _configureStripe} from "../configurators/configure-stripe.js"
import {buildFunctionToPreparePermissionsInteractions} from "../../../features/store2/interactions/permissions-interactions.js"

export async function assimilateStripe({
		databaseRaw, mockStorage,
		config, rando,
		configureStripe,
	}: {
		rando: dbmage.Rando
		config: SecretConfig
		databaseRaw: DatabaseRaw
		mockStorage: dbmage.FlexStorage
		configureStripe: typeof _configureStripe
	}) {

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
		return configureStripe({
			config,
			storeDatabaseRaw,
			preparePermissionsInteractions,
		})
	}
}
