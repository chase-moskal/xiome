
import {addMeta} from "renraku/dist/curries.js"

import {Rando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {prepareConstrainTables} from "../toolbox/dbby/dbby-constrain.js"

import {makeCoreApi} from "../features/core/core-api.js"
import {makeTokenStore} from "../features/core/token-store.js"
import {AppPayload, PlatformConfig, VerifyToken, SignToken} from "../features/core/core-types.js"

import {Tables} from "./assembly-types.js"

export async function assembleBackend({
		rando,
		tables,
		storage,
		signToken,
		verifyToken,
	}: {
		rando: Rando
		tables: Tables
		storage: SimpleStorage
		signToken: SignToken
		verifyToken: VerifyToken
	}) {

	const coreApi = makeCoreApi({
		rando,
		signToken,
		verifyToken,
		constrainTables: prepareConstrainTables(tables.core),
	})

	const tokenStore = makeTokenStore({
		storage,
		authorize: addMeta(async() => ({}), coreApi.authTopic.authorize),
	})

	return {coreApi, tokenStore}
}
