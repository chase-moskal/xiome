
import {PayTables} from "../../tables/types/pay-tables.js"
import {PlatformConfig} from "../../../../auth/auth-types.js"
import {AuthTables} from "../../../../auth/tables/types/auth-tables.js"
import {MakeStripeLiaison} from "../../../stripe/types/make-stripe-liaison.js"
import {BasePolicyOptions} from "../../../../auth/policies/base/types/base-policy-options.js"

export interface PayPolicyOptions extends BasePolicyOptions {
	config: PlatformConfig
	tables: AuthTables & PayTables
	makeStripeLiaison: MakeStripeLiaison
}
