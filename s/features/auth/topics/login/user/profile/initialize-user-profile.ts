
import {generateProfileRow} from "./generate-profile-row.js"
import {AuthTables} from "../../../../tables/types/auth-tables.js"
import {randomXioAvatarSimpleSpec} from "../../../../../xio-components/avatar/helpers/random-xio-avatar-simple-spec.js"

export async function initializeUserProfile({id_user, authTables, email, generateNickname}: {
		id_user: string
		authTables: AuthTables
		email: string | undefined
		generateNickname: () => string
	}) {

	const avatar = JSON.stringify(randomXioAvatarSimpleSpec())

	await authTables.user.profile.create(generateProfileRow({
		id_user,
		avatar,
		generateNickname,
	}))
}
