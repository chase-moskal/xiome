
// import {schema} from "../../../../toolbox/darkvalley.js"
// import {or} from "../../../../toolbox/dbby/dbby-helpers.js"
// import {UserMeta} from "../../../auth/policies/types/user-meta.js"
// import {UserAuth} from "../../../auth/policies/types/user-auth.js"
// import {validateUserSearchTerm} from "./validation/validate-user-search-term.js"
// import {fetchUsers} from "../../../auth/topics/login/user/fetch-users.js"
// import {asServiceParts} from "../../../../framework/api/as-service-parts.js"
// import {AdministrativeApiOptions} from "../types/administrative-api-options.js"
// import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
// import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"
// import {escapeRegex} from "../../../../toolbox/escape-regex.js"

// export const searchUsersParts = ({
// 		config,
// 		authPolicies,
// 	}: AdministrativeApiOptions) => asServiceParts<UserMeta, UserAuth>()({

// 	policy: async(meta, request) => {
// 		const auth = await authPolicies.user.processAuth(meta, request)
// 		auth.checker.requirePrivilege("search users")
// 		return auth
// 	},

// 	expose: {

// 		async searchForUsers({tables, access}, options: {term: string}) {
// 			const {term} = runValidation(options, schema({
// 				term: validateUserSearchTerm,
// 			}))

// 			const regex = new RegExp(escapeRegex(term), "i")

// 			const profiles = await tables.user.profile.read({
// 				limit: 100,
// 				conditions: or(
// 					{search: {userId: regex}},
// 					{search: {nickname: regex}},
// 					{search: {tagline: regex}},
// 				),
// 			})

// 			const userIds = profiles.map(profile => profile.userId)

// 			const permissionsEngine = makePermissionsEngine({
// 				isPlatform: access.appId === config.platform.appDetails.appId,
// 				permissionsTables: tables.permissions,
// 			})

// 			return await fetchUsers({
// 				userIds,
// 				permissionsEngine,
// 				authTables: tables,
// 			})
// 		},
// 	},
// })
