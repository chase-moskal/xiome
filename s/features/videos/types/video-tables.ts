
import {DacastLinkRow} from "./dacast-link.js"
import {VideoHosting} from "./video-concepts.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"

export type ViewPrivilegeRow = {
	label: string
	privilegeId: DamnId
}

export type ViewDacastRow = {
	label: string
	dacastId: string
	type: VideoHosting.DacastType
}

export type VideoTables = {
	dacastAccountLinks: DbbyTable<DacastLinkRow>
	viewPrivileges: DbbyTable<ViewPrivilegeRow>
	viewDacast: DbbyTable<ViewDacastRow>
}
