
import {Profile} from "../../types/profile.js"
import {ProfileRow} from "../../types/user-tables.js"

export const profileFromRow = ({
		avatar,
		tagline,
		nickname,
	}: ProfileRow): Profile => ({

	tagline,
	nickname,
	avatar: JSON.parse(avatar),
})
