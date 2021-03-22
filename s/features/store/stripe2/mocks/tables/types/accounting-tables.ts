
import {MockAccount} from "./rows/mock-account.js"
import {DbbyTable} from "../../../../../../toolbox/dbby/dbby-types.js"

export type AccountingTables = {
	accounts: DbbyTable<MockAccount>
}
