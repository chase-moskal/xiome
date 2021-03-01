
import {asTopic} from "renraku/x/identities/as-topic.js"

import {fetchUser} from "./login/user/fetch-user.js"
import {AnonAuth} from "../types/AnonAuth"
import {AuthApiOptions} from "../types/AuthApiOptions"

export const userTopic = ({generateNickname}: AuthApiOptions) => asTopic<AnonAuth>()({

	async getUser({tables}, {userId}: {userId: string}) {
		return await fetchUser({userId, tables, generateNickname})
	},
})
