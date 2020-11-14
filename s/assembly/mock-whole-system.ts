
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {generateTechnician} from "../features/core/generate-technician.js"
import {mockPlatformConfig} from "../features/core/mock-platform-config.js"
import {mockVerifyGoogleToken} from "../features/core/mock-google-tokens.js"
import {AppPayload, AuthTokens, CoreApi, TriggerAccountPopup} from "../features/core/core-types.js"

import {getRando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {dbbyMemory} from "../toolbox/dbby/dbby-memory.js"

import {Tables} from "./assembly-types.js"
import {expiryGraceTime} from "./constants.js"
import {assembleBackend} from "./assemble-backend.js"
import {assembleFrontend} from "./assemble-frontend.js"

export async function mockWholeSystem({storage, generateNickname}: {
			storage: SimpleStorage
			generateNickname: () => string
		}) {

	// prerequisites and configurations

	const rando = await getRando()
	const {technicianPasskey, technician} = await generateTechnician(rando)
	const config = mockPlatformConfig({rando, technician})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()
	const verifyGoogleToken = mockVerifyGoogleToken
	const tables: Tables = {
		core: {
			account: dbbyMemory(),
			profile: dbbyMemory(),
			userRole: dbbyMemory(),
			rolePrivilege: dbbyMemory(),
			accountViaGoogle: dbbyMemory(),
			accountViaPasskey: dbbyMemory(),
		},
	}

	// backend assembly

	const backend = await assembleBackend({
		rando,
		config,
		tables,
		storage,
		signToken,
		verifyToken,
		generateNickname,
		verifyGoogleToken,
	})

	// mock bridge connecting backend and frontend

	let triggerAccountPopupAction: TriggerAccountPopup = async() => {
		throw new Error("no mock login set")
	}

	function mockNextLogin(auth: () => Promise<AuthTokens>) {
		triggerAccountPopupAction = async() => auth()
	}

	// frontend assembly

	const frontend = await assembleFrontend({
		backend,
		expiryGraceTime,
		triggerAccountPopup: async() => triggerAccountPopupAction(),
	})

	// return everything including internals for testing and debugging

	async function signAppToken(payload: AppPayload) {
		return signToken({payload, lifespan: config.tokens.lifespans.app})
	}

	return {
		config,
		tables,
		backend,
		frontend,
		technicianPasskey,
		signAppToken,
		mockNextLogin,
	}
}
