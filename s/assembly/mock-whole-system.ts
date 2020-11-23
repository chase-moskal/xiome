
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"

import {mockPlatformConfig} from "../features/auth/mocks/mock-platform-config.js"
import {AppPayload, AuthTokens, SendLoginEmail, TriggerAccountPopup} from "../features/auth/auth-types.js"

import {getRando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {dbbyMemory} from "../toolbox/dbby/dbby-memory.js"

import {expiryGraceTime} from "./constants.js"
import {SystemTables} from "./assembly-types.js"
import {assembleBackend} from "./assemble-backend.js"
import {assembleFrontend} from "./assemble-frontend.js"

export async function mockWholeSystem({storage, sendLoginEmail, generateNickname}: {
			storage: SimpleStorage
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
		}) {

	// prerequisites and configurations

	const rando = await getRando()
	const config = mockPlatformConfig({rando})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()
	const tables: SystemTables = {
		auth: {
			account: dbbyMemory(),
			profile: dbbyMemory(),
			userRole: dbbyMemory(),
			rolePrivilege: dbbyMemory(),
			accountViaEmail: dbbyMemory(),
			accountViaGoogle: dbbyMemory(),
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
		sendLoginEmail,
		generateNickname,
	})

	// mock bridge connecting backend and frontend

	let triggerAccountPopupAction: TriggerAccountPopup = async() => {
		throw new Error("no mock login set")
	}

	function setNextLogin(auth: () => Promise<AuthTokens>) {
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
		controls: {
			signAppToken,
			setNextLogin,
		},
	}
}
