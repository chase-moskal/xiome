
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {ProfileRow} from "../../../../tables/types/rows/profile-row.js"

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
