
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"

export type ProfileRow = {
	userId: DamnId
	nickname: string
	tagline: string
	avatar: undefined | string
}
