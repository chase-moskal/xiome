
import {PayTables} from "../../tables/types/store-tables.js"
import {AuthTables} from "../../../../auth/tables/types/auth-tables.js"
import {MakeStripeLiaison} from "../../../stripe/types/make-stripe-liaison.js"
import {AuthPolicyOptions} from "../../../../auth/policies/types/auth-policy-options.js"

export interface StorePolicyOptions extends AuthPolicyOptions {
	tables: AuthTables & PayTables
	makeStripeLiaison: MakeStripeLiaison
}
