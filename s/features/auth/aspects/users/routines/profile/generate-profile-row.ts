
import {ProfileRow} from "../../types/user-tables.js"
import {Id} from "../../../../../../toolbox/dbproxy/dbproxy.js"

export const generateProfileRow = ({userId, avatar, generateNickname}: {
		userId: Id
		avatar: undefined | string
		generateNickname: () => string
	}): ProfileRow => ({

	userId,
	avatar,
	tagline: "",
	nickname: generateNickname(),
})
