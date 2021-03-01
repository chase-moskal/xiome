
import {asTopic} from "renraku/x/identities/as-topic.js"

import {fetchUser} from "./login/user/fetch-user.js"
import {AnonAuth} from "../policies/types/anon-auth.js"
import {AuthApiOptions} from "../types/auth-api-options"

export const userTopic = ({generateNickname}: AuthApiOptions) => asTopic<AnonAuth>()({

	async getUser({tables}, {userId}: {userId: string}) {
		return await fetchUser({userId, tables, generateNickname})
	},
})
