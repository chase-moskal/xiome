
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {UserAuth} from "../../../../../auth/policies/types/user-auth.js"

export type CustomerAuth = StoreAuthSpecifics & UserAuth
