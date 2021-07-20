
import {Profile} from "../../../../types/profile.js"
import {ProfileRow} from "../../../../tables/types/rows/profile-row.js"

export const profileFromRow = ({
		avatar,
		tagline,
		nickname,
	}: ProfileRow): Profile => ({

	tagline,
	nickname,
	avatar: JSON.parse(avatar),
})
