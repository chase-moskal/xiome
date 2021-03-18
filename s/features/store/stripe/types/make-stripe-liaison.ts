
import {StripeLiaison} from "./stripe-liaison.js"
import {StoreTables} from "../../api/tables/types/store-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"

export type MakeStripeLiaison = ({}: {
	stripeConnectAccountId: string
	tables: StoreTables & AuthTables
}) => Promise<StripeLiaison>
