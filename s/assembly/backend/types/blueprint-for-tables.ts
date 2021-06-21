
import {Tables} from "./tables.js"
import {DbbyRow, DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export type BlueprintForTables<
		xTables extends Tables
	> = {

	[P in keyof xTables]: xTables[P] extends DbbyTable<DbbyRow>
		? true
		: xTables[P] extends Tables
			? BlueprintForTables<xTables[P]>
			: never
}
