
import {Stripe} from "stripe"
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {AnonAuth} from "../../../../../auth/policies/types/anon-auth.js"

export type ProspectAuth = {
	getStripeAccount: (id: string) => Promise<Stripe.Account>
} & StoreAuthSpecifics & AnonAuth
