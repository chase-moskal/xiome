
import {ProfileRow} from "../../../types/profile-row.js"
import {Profile} from "../../../types/profile.js"

export const profileFromRow = ({
			avatar,
			tagline,
			nickname,
		}: ProfileRow): Profile => ({

	avatar,
	tagline,
	nickname,
})
