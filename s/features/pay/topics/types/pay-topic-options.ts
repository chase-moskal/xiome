
import {Rando} from "../../../../toolbox/get-rando.js"
import {stripeAccountLiaison} from "../../stripe/stripe-account-liaison.js"

export interface PayTopicOptions {
	rando: Rando
	stripeAccountLiaison: ReturnType<typeof stripeAccountLiaison>
}
