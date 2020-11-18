
import {addMeta} from "renraku/dist/curries.js"

import {Rando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {prepareConstrainTables} from "../toolbox/dbby/dbby-constrain.js"

import {makeCoreApi} from "../features/core/core-api.js"
import {makeTokenStore} from "../features/core/token-store.js"
import {VerifyToken, SignToken, VerifyGoogleToken, PlatformConfig, SendEmail} from "../features/core/core-types.js"

import {Tables} from "./assembly-types.js"

export async function assembleBackend({
			rando,
			config,
			tables,
			storage,
			sendEmail,
			signToken,
			verifyToken,
			generateNickname,
			verifyGoogleToken,
		}: {
			rando: Rando
			tables: Tables
			storage: SimpleStorage
			config: PlatformConfig
			sendEmail: SendEmail
			signToken: SignToken
			verifyToken: VerifyToken
			generateNickname: () => string
			verifyGoogleToken: VerifyGoogleToken
		}) {

	const coreApi = makeCoreApi({
		rando,
		config,
		signToken,
		verifyToken,
		sendEmail,
		generateNickname,
		verifyGoogleToken,
		constrainTables: prepareConstrainTables(tables.core),
	})

	const tokenStore = makeTokenStore({
		storage,
		authorize: addMeta(async() => ({}), coreApi.authTopic.authorize),
	})

	return {coreApi, tokenStore}
}
