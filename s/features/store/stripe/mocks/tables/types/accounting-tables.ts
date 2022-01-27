
import {MockAccount} from "./rows/mock-account.js"
import * as dbmage from "dbmage"

export type AccountingTables = {
	accounts: dbmage.Table<MockAccount>
}
