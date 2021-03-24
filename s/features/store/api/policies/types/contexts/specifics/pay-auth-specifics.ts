
import {StoreTables} from "../../../../tables/types/store-tables.js"
import {AuthTables} from "../../../../../../auth/tables/types/auth-tables.js"

export type StoreAuthSpecifics = {
	tables: StoreTables & AuthTables
}
