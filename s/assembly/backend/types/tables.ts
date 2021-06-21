
import {DbbyRow, DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export interface Tables {
	[key: string]: Tables | DbbyTable<DbbyRow>
}
