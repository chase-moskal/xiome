
import {ProfileRow, Profile} from "../../../core-types.js"

export const profileFromRow = ({
			avatar,
			tagline,
			nickname,
		}: ProfileRow): Profile => ({
	avatar,
	tagline,
	nickname,
})
