
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"

export type LivestreamTables = {
	shows: DbbyTable<LivestreamShow>
}

export type LivestreamShow = {
	label: string
	vimeoId: null | string
}
