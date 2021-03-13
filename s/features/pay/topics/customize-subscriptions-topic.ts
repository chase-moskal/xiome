
import {asTopic} from "renraku/x/identities/as-topic.js"
import {CustomerAuth} from "../api/policies/types/contexts/customer-auth.js"

export const customizeSubscriptionsTopic = () => asTopic<CustomerAuth>()({

	async lol({tables, stripeLiaison}, {userId}: {userId: string}) {
		return true
	},
})
