
import {asTopic} from "renraku/x/identities/as-topic.js"
import {PayTopicOptions} from "./types/pay-topic-options.js"
import {PayUserAuth} from "../api/policies/types/contexts/pay-user-auth.js"

export const premiumTopic = ({
			rando,
		}: PayTopicOptions) => asTopic<PayUserAuth>()({

	async lol({payTables, stripeLiaison}, {userId}: {userId: string}) {
		return true
	},
})
