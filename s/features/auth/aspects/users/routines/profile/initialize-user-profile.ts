
import {AuthSchema} from "../../../../types/auth-schema.js"
import {generateProfileRow} from "./generate-profile-row.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {randomXioAvatarSimpleSpec} from "../../../../../xio-components/avatar/helpers/random-xio-avatar-simple-spec.js"

export async function initializeUserProfile({userId, authTables, email, generateNickname}: {
		userId: DamnId
		authTables: AuthSchema
		email: string | undefined
		generateNickname: () => string
	}) {

	const avatar = JSON.stringify(randomXioAvatarSimpleSpec())

	await authTables.users.profiles.create(generateProfileRow({
		userId,
		avatar,
		generateNickname,
	}))
}
