
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {AuthTables, VerifyToken} from "../auth-types.js"
import {ConstrainTables} from "../../../toolbox/dbby/dbby-types.js"

import {fetchUser} from "./login/user/fetch-user.js"
import {prepareAnonOnAnyApp} from "./auth-processors/anon-on-any-app.js"

export function makeUserTopic({
			verifyToken,
			constrainTables,
			generateNickname,
		}: {
			verifyToken: VerifyToken
			generateNickname: () => string
			constrainTables: ConstrainTables<AuthTables>
		}) {
	return processAuth(prepareAnonOnAnyApp({verifyToken, constrainTables}), {

		async getUser({tables}, {userId}: {
					userId: string
				}) {
			return await fetchUser({userId, tables, generateNickname})
		},
	})
}
