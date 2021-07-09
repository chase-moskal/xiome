
import {ProfileRow} from "../../../../tables/types/rows/profile-row.js"

export const generateProfileRow = ({id_user, avatar, generateNickname}: {
		id_user: string
		avatar: undefined | string
		generateNickname: () => string
	}): ProfileRow => ({

	id_user,
	avatar,
	tagline: "",
	nickname: generateNickname(),
})
