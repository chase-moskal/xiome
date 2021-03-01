
import {ProfileRow} from "../../../types/auth-types.js"

export const generateProfileRow = ({userId, generateNickname}: {
			userId: string
			generateNickname: () => string
		}): ProfileRow => ({

	userId,
	tagline: "",
	avatar: "",
	nickname: generateNickname(),
})
