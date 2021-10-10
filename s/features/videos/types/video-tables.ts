
import {DacastLinkRow} from "./dacast-link.js"
import {DacastData} from "../dacast/types/dacast-data.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export type ViewPrivilegeRow = {
	label: string
	privilegeId: DamnId
}

export type ViewDacastRow = {
	label: string
	dacastId: string
	type: DacastData.ContentType
}

export type VideoTables = {
	dacastAccountLinks: DbbyTable<DacastLinkRow>
	viewPrivileges: DbbyTable<ViewPrivilegeRow>
	viewDacast: DbbyTable<ViewDacastRow>
}
