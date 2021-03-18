
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {UserAuth} from "../../../../../auth/policies/types/user-auth.js"
import {StripeLiaison} from "../../../../stripe/types/stripe-liaison.js"

export type CustomerAuth = {
	stripeLiaison: StripeLiaison
} & StoreAuthSpecifics & UserAuth
