
import {MockAccount} from "./rows/mock-account.js"
import * as dbproxy from "../../../../../../toolbox/dbproxy/dbproxy.js"

export type AccountingTables = {
	accounts: dbproxy.Table<MockAccount>
}
