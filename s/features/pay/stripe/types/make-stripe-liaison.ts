
import {StripeLiaison} from "./stripe-liaison.js"
import {PayTables} from "../../api/tables/types/pay-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"

export type MakeStripeLiaison = ({}: {
	tables: AuthTables & PayTables
}) => Promise<StripeLiaison>
