
import {ProfileRow} from "../../../../tables/types/rows/profile-row.js"

export const generateProfileRow = ({userId, avatar, generateNickname}: {
		userId: string
		avatar: undefined | string
		generateNickname: () => string
	}): ProfileRow => ({

	userId,
	avatar,
	tagline: "",
	nickname: generateNickname(),
})
