
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {DacastLinkRow} from "./dacast-link.js"
import {DacastData} from "../dacast/types/dacast-data.js"

export type ViewPrivilegeRow = dbproxy.AsRow<{
	label: string
	privilegeId: dbproxy.Id
}>

export type ViewDacastRow = dbproxy.AsRow<{
	label: string
	dacastId: string
	type: DacastData.ContentType
}>

export type VideoSchema = dbproxy.AsSchema<{
	dacastAccountLinks: DacastLinkRow
	viewPrivileges: ViewPrivilegeRow
	viewDacast: ViewDacastRow
}>
