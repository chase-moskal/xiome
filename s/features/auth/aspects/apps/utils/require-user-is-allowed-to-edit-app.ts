
// import {ApiError} from "renraku/x/api/api-error.js"
// import {AuthTables} from "../../tables/types/auth-tables.js"
// import {isUserOwnerOfApp} from "./is-user-the-owner-of-app.js"
// import {AccessPayload} from "../../types/tokens/access-payload.js"

// export async function requireUserIsAllowedToEditApp(options: {
// 		appId: string
// 		tables: AuthTables
// 		access: AccessPayload
// 	}) {

// 	const owner = await isUserOwnerOfApp(options)
// 	if (!owner)
// 		throw new ApiError(403, "user is not allowed")
// }
