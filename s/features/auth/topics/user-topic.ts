
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {AuthTables, GetTables, VerifyToken} from "../auth-types.js"

import {fetchUser} from "./login/user/fetch-user.js"
import {processRequestForAnon} from "./auth-processors/process-request-for-anon.js"

export function makeUserTopic({
			getTables,
			verifyToken,
			generateNickname,
		}: {
			verifyToken: VerifyToken
			generateNickname: () => string
			getTables: GetTables<AuthTables>
		}) {
	return processAuth(processRequestForAnon({verifyToken, getTables}), {

		async getUser({tables}, {userId}: {
					userId: string
				}) {
			return await fetchUser({userId, tables, generateNickname})
		},
	})
}
