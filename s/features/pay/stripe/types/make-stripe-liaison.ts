
import {StripeLiaison} from "./stripe-liaison.js"
import {PayTables} from "../../api/types/tables/pay-tables.js"

export type MakeStripeLiaison = ({payTables}: {
	payTables: PayTables
}) => Promise<StripeLiaison>
