
import {Id} from "../../toolbox/dbproxy/dbproxy.js"

import {Rando} from "../../toolbox/get-rando.js"
import {AccessPayload} from "../../features/auth/types/auth-tokens.js"

export function mockAccess({
		rando,
		appId,
		appOrigin,
		privileges,
	}: {
		rando: Rando
		appId: Id
		appOrigin: string
		privileges: string[]
	}): AccessPayload {

	const userId = rando.randomId2().toString()

	return {
		appId: appId.toString(),
		origins: [appOrigin],
		permit: {privileges},
		scope: {core: true},
		user: {
			userId: rando.randomId2().toString(),
			profile: {
				avatar: undefined,
				nickname: `user ${userId.slice(0, 6)}`,
				tagline: "",
			},
			roles: [],
			stats: {joined: Date.now()},
		},
	}
}
