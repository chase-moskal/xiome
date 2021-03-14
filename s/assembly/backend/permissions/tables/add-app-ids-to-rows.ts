
import {DbbyRow} from "../../../../toolbox/dbby/dbby-types.js"

export function addAppIdsToRows<Row extends DbbyRow>(
		rows: Row[],
		namespaceKeyAppId: string,
		appId: string,
	) {

	return rows.map(row => ({
		...row,
		[namespaceKeyAppId]: appId,
	}))
}
