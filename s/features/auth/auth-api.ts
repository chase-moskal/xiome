
import {apiContext} from "renraku/x/api/api-context.js"

import {appTopic} from "./topics/app-topic.js"
import {userTopic} from "./topics/user-topic.js"
import {loginTopic} from "./topics/login-topic.js"
import {AuthTables} from "./tables/types/auth-tables.js"
import {personalTopic} from "./topics/personal-topic.js"
import {appTokenTopic} from "./topics/app-token-topic.js"
import {permissionsTopic} from "./topics/permissions-topic.js"
import {manageAdminsTopic} from "./topics/manage-admins-topic.js"
import {prepareAuthPolicies} from "./policies/prepare-auth-policies.js"
import {AppTables} from "./types/AppTables"
import {UserTables} from "./types/UserTables"
import {PermissionsTables} from "./types/PermissionsTables"
import {UnconstrainedPlatformUserAuth} from "./types/UnconstrainedPlatformUserAuth.js"
import {UnconstrainedPlatformUserMeta} from "./types/UnconstrainedPlatformUserMeta.js"
import {PlatformUserAuth} from "./types/PlatformUserAuth.js"
import {PlatformUserMeta} from "./types/PlatformUserMeta.js"
import {UserAuth} from "./types/UserAuth.js"
import {UserMeta} from "./types/UserMeta.js"
import {AnonAuth} from "./types/AnonAuth.js"
import {AnonMeta} from "./types/AnonMeta.js"
import {GreenAuth} from "./types/GreenAuth.js"
import {GreenMeta} from "./types/GreenMeta.js"
import {AuthApiOptions} from "./types/AuthApiOptions"

export const makeAuthApi = ({tables, ...options}:
		AuthApiOptions & {tables: AuthTables}) => {

	const {verifyToken, config} = options

	const policies = prepareAuthPolicies({
		config,
		tables,
		verifyToken,
	})

	return {
		appTokenService: apiContext<GreenMeta, GreenAuth>()({
			policy: policies.green,
			expose: appTokenTopic(options),
		}),

		loginService: apiContext<AnonMeta, AnonAuth>()({
			policy: policies.anon,
			expose: loginTopic(options),
		}),
	
		appService: apiContext<PlatformUserMeta, PlatformUserAuth>()({
			policy: policies.platformUser,
			expose: appTopic(options),
		}),

		manageAdminsService: apiContext<
				UnconstrainedPlatformUserMeta,
				UnconstrainedPlatformUserAuth
			>()({
			policy: policies.unconstrainedPlatformUser,
			expose: manageAdminsTopic(options),
		}),

		personalService: apiContext<UserMeta, UserAuth>()({
			policy: policies.user,
			expose: personalTopic(options),
		}),
	
		userService: apiContext<AnonMeta, AnonAuth>()({
			policy: policies.anon,
			expose: userTopic(options),
		}),

		permissionsService: apiContext<UserMeta, UserAuth>()({
			policy: policies.userWhoManagesPermissions,
			expose: permissionsTopic(options),
		}),
	}
}
