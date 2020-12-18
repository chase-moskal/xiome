
import {DbbyRow} from "../../../../toolbox/dbby/dbby-types.js"

export function addAppIdsToRows<Row extends DbbyRow>(rows: Row[], appId: string) {
	return rows.map(row => ({...row, appId}))
}
