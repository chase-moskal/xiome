
import {asTopic} from "renraku/x/identities/as-topic.js"

import {AnonAuth, AuthOptions} from "../auth-types.js"
import {fetchUser} from "./login/user/fetch-user.js"

export const userTopic = ({generateNickname}: AuthOptions) => asTopic<AnonAuth>()({

	async getUser({tables}, {userId}: {userId: string}) {
		return await fetchUser({userId, tables, generateNickname})
	},
})
