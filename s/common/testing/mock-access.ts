
import {AccessPayload} from "../../features/auth/types/auth-tokens.js"
import {DamnId} from "../../toolbox/damnedb/damn-id.js"
import {Rando} from "../../toolbox/get-rando.js"

export function mockAccess({
		rando,
		appId,
		appOrigin,
		privileges,
	}: {
		rando: Rando
		appId: DamnId
		appOrigin: string
		privileges: string[]
	}): AccessPayload {

	const userId = rando.randomId().toString()

	return {
		appId: appId.toString(),
		origins: [appOrigin],
		permit: {privileges},
		scope: {core: true},
		user: {
			userId: rando.randomId().toString(),
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
