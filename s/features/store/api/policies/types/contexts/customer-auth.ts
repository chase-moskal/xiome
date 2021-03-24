
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {UserAuth} from "../../../../../auth/policies/types/user-auth.js"
import {AppStripeLiaison} from "../../../../stripe2/types/app-stripe-liaison.js"

export type CustomerAuth = {
	appStripeLiaison: AppStripeLiaison
} & StoreAuthSpecifics & UserAuth
