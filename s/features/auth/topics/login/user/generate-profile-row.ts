
import {ProfileRow} from "../../../tables/types/rows/profile-row.js"

export const generateProfileRow = ({userId, generateNickname}: {
			userId: string
			generateNickname: () => string
		}): ProfileRow => ({

	userId,
	tagline: "",
	avatar: "",
	nickname: generateNickname(),
})
