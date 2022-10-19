
import * as dbmage from "dbmage"

import {DatabaseRaw} from "../types/database.js"
import {SecretConfig} from "../types/secret-config.js"
import type {configureStripe as _configureStripe} from "../configurators/configure-stripe.js"
import {mockStripeCircuit} from "../../../features/store/backend/stripe/mock-stripe-circuit.js"
import {buildFunctionToPrepareRoleManager} from "../../../features/auth/aspects/permissions/interactions/role-manager.js"

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

	const prepareRoleManager = (
		buildFunctionToPrepareRoleManager({
			rando,
			permissionsDatabaseRaw,
		})
	)

	if (config.stripe === "mock-mode") {
		return mockStripeCircuit({
			webRoot: config.webRoot,
			rando,
			logger,
			tableStorage: mockStorage,
			storeDatabaseRaw,
			prepareRoleManager,
		})
	}
	else {
		return configureStripe({
			config,
			storeDatabaseRaw,
			prepareRoleManager,
		})
	}
}
