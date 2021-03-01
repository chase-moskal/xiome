
import {ProfileRow} from "../../../types/profile-row"

export const generateProfileRow = ({userId, generateNickname}: {
			userId: string
			generateNickname: () => string
		}): ProfileRow => ({

	userId,
	tagline: "",
	avatar: "",
	nickname: generateNickname(),
})
