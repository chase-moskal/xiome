
import {generateProfileRow} from "./generate-profile-row.js"
import {AuthTables} from "../../../../tables/types/auth-tables.js"
import {randomXioAvatarSimpleSpec} from "../../../../../xio-components/avatar/helpers/random-xio-avatar-simple-spec.js"

export async function initializeUserProfile({userId, authTables, email, generateNickname}: {
		userId: string
		authTables: AuthTables
		email: string | undefined
		generateNickname: () => string
	}) {

	const avatar = JSON.stringify(randomXioAvatarSimpleSpec())

	await authTables.user.profile.create(generateProfileRow({
		userId,
		avatar,
		generateNickname,
	}))
}
