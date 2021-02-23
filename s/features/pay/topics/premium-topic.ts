
import {asTopic} from "renraku/x/identities/as-topic.js"

import {PayUserAuth} from "../types/policies/contexts/pay-user-auth.js"
import {PayTopicOptions} from "../types/topics/pay-topic-options.js"

export const premiumTopic = ({rando}: PayTopicOptions) => asTopic<PayUserAuth>()({

	async lol({tables}, {userId}: {userId: string}) {
		return true
	},
})
