
import {ProfileRow, Profile} from "../../../types/auth-types.js"

export const profileFromRow = ({
			avatar,
			tagline,
			nickname,
		}: ProfileRow): Profile => ({

	avatar,
	tagline,
	nickname,
})
