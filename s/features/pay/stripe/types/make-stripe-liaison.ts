
import {StripeLiaison} from "./stripe-liaison.js"
import {PayTables} from "../../api/tables/types/pay-tables.js"

export type MakeStripeLiaison = ({}: {
	tables: PayTables
}) => Promise<StripeLiaison>
