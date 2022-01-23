
import {Id, find} from "../../../../../../toolbox/dbproxy/dbproxy.js"

import {AuthSchema} from "../../../../types/auth-schema.js"
import {generateProfileRow} from "./generate-profile-row.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {randomXioAvatarSimpleSpec} from "../../../../../xio-components/avatar/helpers/random-xio-avatar-simple-spec.js"
import {DatabaseSafe} from "../../../../../../assembly/backend/types/database.js"

export async function initializeUserProfile({userId, database, email, generateNickname}: {
		userId: Id
		database: DatabaseSafe
		email: string | undefined
		generateNickname: () => string
	}) {

	const avatar = JSON.stringify(randomXioAvatarSimpleSpec())

	await database.tables.auth.users.profiles.create(generateProfileRow({
		userId,
		avatar,
		generateNickname,
	}))
}
