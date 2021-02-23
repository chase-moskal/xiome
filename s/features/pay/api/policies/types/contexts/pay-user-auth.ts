
import {PayTables} from "../../../types/tables/pay-tables.js"
import {BaseUserAuth} from "../../../../../auth/policies/base/types/contexts/base-user-auth.js"

export interface PayUserAuth extends BaseUserAuth {
	tables: PayTables
}
