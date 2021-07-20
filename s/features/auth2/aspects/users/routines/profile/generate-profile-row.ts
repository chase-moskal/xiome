
import {ProfileRow} from "../../types/user-tables.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"

export const generateProfileRow = ({userId, avatar, generateNickname}: {
		userId: DamnId
		avatar: undefined | string
		generateNickname: () => string
	}): ProfileRow => ({

	userId,
	avatar,
	tagline: "",
	nickname: generateNickname(),
})
