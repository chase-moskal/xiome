
// import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token"
// import {Policy} from "renraku/x/types/primitives/policy.js"
// import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"
// import {AnonAuth, AnonMeta} from "../../auth/types/auth-metas.js"
// import {AuthTables} from "../../auth/types/auth-tables.js"
// import {AccessPayload} from "../../auth/types/auth-tokens.js"


// export function mockAnonPolicy({authTables}: {
// 		authTables: UnconstrainedTables<AuthTables>
// 	}): Policy<AnonMeta, AnonAuth> {

// 	const verifyToken = mockVerifyToken()

// 	return async({accessToken}, request) => {
// 		const access = await verifyToken<AccessPayload>(accessToken)
// 		return {
// 			access,
// 			authTables: authTables.namespaceForApp()
// 		}
// 	}
// }
