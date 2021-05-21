
import {gravatar} from "../../../../../../toolbox/gravatar.js"
import {AuthTables} from "../../../../tables/types/auth-tables.js"
import {generateProfileRow} from "./generate-profile-row.js"

export async function initializeUserProfile({userId, authTables, email, generateNickname}: {
		userId: string
		authTables: AuthTables
		email: string | undefined
		generateNickname: () => string
	}) {

	const avatar = email
		? gravatar(email)
		: undefined

	await authTables.user.profile.create(generateProfileRow({
		userId,
		avatar,
		generateNickname,
	}))
}
