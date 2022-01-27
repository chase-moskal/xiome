
import * as dbmage from "dbmage"

import {DacastLinkRow} from "./dacast-link.js"
import {DacastData} from "../dacast/types/dacast-data.js"

export type ViewPrivilegeRow = dbmage.AsRow<{
	label: string
	privilegeId: dbmage.Id
}>

export type ViewDacastRow = dbmage.AsRow<{
	label: string
	dacastId: string
	type: DacastData.ContentType
}>

export type VideoSchema = dbmage.AsSchema<{
	dacastAccountLinks: DacastLinkRow
	viewPrivileges: ViewPrivilegeRow
	viewDacast: ViewDacastRow
}>
