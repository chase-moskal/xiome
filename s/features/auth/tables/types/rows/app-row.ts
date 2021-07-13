
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"

export type AppRow = {
	appId: DamnId
	label: string
	home: string
	origins: string
	archived: boolean
}
