
import {ProfileRow} from "../../../types/profile-row"
import {Profile} from "../../../types/profile"

export const profileFromRow = ({
			avatar,
			tagline,
			nickname,
		}: ProfileRow): Profile => ({

	avatar,
	tagline,
	nickname,
})
