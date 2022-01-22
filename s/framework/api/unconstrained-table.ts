
import * as dbproxy from "../../toolbox/dbproxy/dbproxy.js"
import {appConstraintKey} from "../../assembly/backend/types/database.js"

export class UnconstrainedTable<xRow extends dbproxy.Row> {
	#table: dbproxy.Table<xRow>

	constructor(table: dbproxy.Table<xRow>) {
		this.#table = table
	}

	get unconstrained() {
		return this.#table
	}

	namespaceForApp(appId: dbproxy.Id) {
		return dbproxy.constrain({
			table: this.#table,
			constraint: {[appConstraintKey]: appId}
		})
	}
}
