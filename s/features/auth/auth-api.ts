
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
import {AppTables} from "./types/app-tables"
import {UserTables} from "./types/user-tables"
import {PermissionsTables} from "./types/permissions-tables"
import {UnconstrainedPlatformUserAuth} from "./types/unconstrained-platform-user-auth.js"
import {UnconstrainedPlatformUserMeta} from "./types/unconstrained-platform-user-meta.js"
import {PlatformUserAuth} from "./types/platform-user-auth.js"
import {PlatformUserMeta} from "./types/platform-user-meta.js"
import {UserAuth} from "./types/user-auth.js"
import {UserMeta} from "./types/user-meta.js"
import {AnonAuth} from "./types/anon-auth.js"
import {AnonMeta} from "./types/anon-meta.js"
import {GreenAuth} from "./types/green-auth.js"
import {GreenMeta} from "./types/green-meta.js"
import {AuthApiOptions} from "./types/auth-api-options"

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
