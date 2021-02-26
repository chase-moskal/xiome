
import {StripeLiaison} from "./stripe-liaison.js"
import {PermissionsTables} from "../../../auth/auth-types.js"
import {PayTables} from "../../api/types/tables/pay-tables.js"

export type MakeStripeLiaison = ({}: {
	payTables: PayTables
	permissionsTables: PermissionsTables
}) => Promise<StripeLiaison>
