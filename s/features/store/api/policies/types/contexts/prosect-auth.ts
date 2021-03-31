
import {Stripe} from "stripe"
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {UserAuth} from "../../../../../auth/policies/types/user-auth.js"

export type ProspectAuth = {
	getStripeAccount: (id: string) => Promise<Stripe.Account>
} & StoreAuthSpecifics & UserAuth
