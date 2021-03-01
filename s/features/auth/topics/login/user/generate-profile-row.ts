
import {ProfileRow} from "../../../types/ProfileRow"

export const generateProfileRow = ({userId, generateNickname}: {
			userId: string
			generateNickname: () => string
		}): ProfileRow => ({

	userId,
	tagline: "",
	avatar: "",
	nickname: generateNickname(),
})
