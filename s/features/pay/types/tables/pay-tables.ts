
import {ExampleRow} from "./rows/example-row.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"

export interface PayTables {
	example: DbbyTable<ExampleRow>
}
