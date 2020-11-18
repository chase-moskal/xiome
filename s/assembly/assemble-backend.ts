
import {addMeta} from "renraku/dist/curries.js"

import {Rando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {prepareConstrainTables} from "../toolbox/dbby/dbby-constrain.js"

import {makeAuthApi} from "../features/auth/auth-api.js"
import {makeTokenStore} from "../features/auth/token-store.js"
import {VerifyToken, SignToken, PlatformConfig, SendEmail} from "../features/auth/auth-types.js"

import {SystemTables} from "./assembly-types.js"

export async function assembleBackend({
			rando,
			config,
			tables,
			storage,
			sendEmail,
			signToken,
			verifyToken,
			generateNickname,
		}: {
			rando: Rando
			tables: SystemTables
			storage: SimpleStorage
			config: PlatformConfig
			sendEmail: SendEmail
			signToken: SignToken
			verifyToken: VerifyToken
			generateNickname: () => string
		}) {

	const authApi = makeAuthApi({
		rando,
		config,
		signToken,
		verifyToken,
		sendEmail,
		generateNickname,
		constrainTables: prepareConstrainTables(tables.auth),
	})

	const tokenStore = makeTokenStore({
		storage,
		expiryRenewalCushion: config.tokens.expiryRenewalCushion,
		authorize: addMeta(async() => ({}), authApi.loginTopic.authorize),
	})

	return {authApi, tokenStore}
}
