
import {mockSignToken} from "redcrypto/dist/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/dist/curries/mock-verify-token.js"


import {getRando} from "../toolbox/get-rando.js"
import {SimpleStorage} from "../toolbox/json-storage.js"
import {dbbyMemory} from "../toolbox/dbby/dbby-memory.js"

import {assembleApi} from "./assemble-api.js"
import {assembleFrontend} from "./assemble-frontend.js"
import {prepareMockRemote} from "./remote/mock-remote.js"
import {SystemTables} from "./types/backend/system-tables.js"
import {mockPlatformConfig} from "../features/auth/mocks/mock-platform-config.js"
import {AppPayload, AuthTokens, SendLoginEmail, TriggerAccountPopup} from "../features/auth/auth-types.js"

export async function mockWholeSystem({storage, sendLoginEmail, generateNickname}: {
		storage: SimpleStorage
		sendLoginEmail: SendLoginEmail
		generateNickname: () => string
	}) {

	//
	// prerequisites and configurations
	//

	const rando = await getRando()
	const config = mockPlatformConfig({rando})
	const signToken = mockSignToken()
	const verifyToken = mockVerifyToken()

	const tables: SystemTables = {
		auth: {
			role: dbbyMemory(),
			account: dbbyMemory(),
			profile: dbbyMemory(),
			userRole: dbbyMemory(),
			privilege: dbbyMemory(),
			rolePrivilege: dbbyMemory(),
			accountViaEmail: dbbyMemory(),
			accountViaGoogle: dbbyMemory(),
			app: dbbyMemory(),
			appToken: dbbyMemory(),
			appOwnership: dbbyMemory(),
		},
	}

	//
	// api assembly
	//

	const api = assembleApi({
		rando,
		config,
		tables,
		signToken,
		verifyToken,
		sendLoginEmail,
		generateNickname,
	})

	//
	// frontend assembly
	//

	async function assembleFrontendForApp(appToken: string) {
		const {remote, authController} = prepareMockRemote({api, appToken})

		let triggerAccountPopupAction: TriggerAccountPopup = async() => {
			throw new Error("no mock login set")
		}

		const frontend = await assembleFrontend({
			remote,
			storage,
			authController,
			triggerAccountPopup: async() => triggerAccountPopupAction(),
		})

		const frontHacks = {
			setNextLogin(auth: () => Promise<AuthTokens>) {
				triggerAccountPopupAction = async() => auth()
			},
		}

		return {frontend, frontHacks, remote}
	}

	//
	// return everything
	//

	return {
		config,
		tables,
		assembleFrontendForApp,
		hacks: {
			async signAppToken(payload: AppPayload) {
				return signToken({payload, lifespan: config.tokens.lifespans.app})
			},
		},
	}
}
