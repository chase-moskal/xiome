
import {ProfileRow} from "../../../types/ProfileRow"
import {Profile} from "../../../types/Profile"

export const profileFromRow = ({
			avatar,
			tagline,
			nickname,
		}: ProfileRow): Profile => ({

	avatar,
	tagline,
	nickname,
})
