
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {Rando} from "../toolbox/get-rando.js"
import {prepareConstrainTables} from "../toolbox/dbby/dbby-constrain.js"

import {makeCoreApi} from "../features/core/core-api.js"
import {PlatformConfig} from "../features/core/core-types.js"

import {Tables} from "./assembly-types.js"

export async function assembleBackend({rando, tables, config}: {
		rando: Rando
		tables: Tables
		config: PlatformConfig
	}) {

	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()

	return {
		coreApi: makeCoreApi({
			rando,
			signToken,
			verifyToken,
			constrainTables: prepareConstrainTables(tables.core),
		}),
	}
}
