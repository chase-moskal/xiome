
import {asTopic} from "renraku/x/identities/as-topic.js"
import {PayTopicOptions} from "./types/pay-topic-options.js"
import {PayUserAuth} from "../api/policies/types/contexts/pay-user-auth.js"

export const stripeAccountsTopic = ({
			rando,
			stripeLiaison,
		}: PayTopicOptions) => asTopic<PayUserAuth>()({

	async createAccountPopup({tables, access}): Promise<{
			popupUrl: string
		}> {

		// TODO

		// get or create stripe account

		// create an account link and return the url
		
		return {
			popupUrl: "lol",
		}
	},
})
