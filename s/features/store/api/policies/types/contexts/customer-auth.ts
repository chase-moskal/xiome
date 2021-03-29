
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {UserAuth} from "../../../../../auth/policies/types/user-auth.js"
import {StripeLiaisonForApp} from "../../../../stripe2/types/stripe-liaison-app.js"

export type CustomerAuth = {
	stripeLiaisonForApp: StripeLiaisonForApp
} & StoreAuthSpecifics & UserAuth
