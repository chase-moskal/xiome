
import {ProfileRow} from "../../../auth-types.js"

export const generateProfileRow = ({userId, generateNickname}: {
			userId: string
			generateNickname: () => string
		}): ProfileRow => ({

	userId,
	tagline: "",
	avatar: "",
	nickname: generateNickname(),
})
