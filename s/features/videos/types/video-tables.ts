
import {DacastLinkSecret} from "./dacast-link.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export type VideoTables = {
	dacastAccountLinks: DbbyTable<DacastLinkSecret>
}
