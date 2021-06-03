
import {asApi} from "renraku/x/identities/as-api.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {appTopic} from "./topics/app-topic.js"
import {userTopic} from "./topics/user-topic.js"
import {loginTopic} from "./topics/login-topic.js"
import {AuthTables} from "./tables/types/auth-tables.js"
import {personalTopic} from "./topics/personal-topic.js"
import {greenTopic} from "./topics/green-topic.js"
import {permissionsTopic} from "./topics/permissions-topic.js"
import {manageAdminsTopic} from "./topics/manage-admins-topic.js"
import {prepareAuthPolicies} from "./policies/prepare-auth-policies.js"
import {PlatformUserAuth} from "./policies/types/platform-user-auth.js"
import {PlatformUserMeta} from "./policies/types/platform-user-meta.js"
import {UserAuth} from "./policies/types/user-auth.js"
import {UserMeta} from "./policies/types/user-meta.js"
import {AnonAuth} from "./policies/types/anon-auth.js"
import {AnonMeta} from "./policies/types/anon-meta.js"
import {GreenAuth} from "./policies/types/green-auth.js"
import {GreenMeta} from "./policies/types/green-meta.js"
import {AuthApiOptions} from "./types/auth-api-options.js"
import {AppOwnerMeta} from "./policies/types/app-owner-meta.js"
import {AppOwnerAuth} from "./policies/types/app-owner-auth.js"
import {appEditTopic} from "./topics/app-edit-topic.js"

export const makeAuthApi = ({tables, authPolicies, ...options}: {
		tables: AuthTables
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	} & AuthApiOptions) => {

	return asApi({
		greenService: apiContext<GreenMeta, GreenAuth>()({
			policy: authPolicies.green,
			expose: greenTopic(options),
		}),

		loginService: apiContext<AnonMeta, AnonAuth>()({
			policy: authPolicies.anon,
			expose: loginTopic(options),
		}),
	
		appService: apiContext<PlatformUserMeta, PlatformUserAuth>()({
			policy: authPolicies.platformUser,
			expose: appTopic(options),
		}),

		appEditService: apiContext<AppOwnerMeta, AppOwnerAuth>()({
			policy: authPolicies.appOwner,
			expose: appEditTopic(options),
		}),

		manageAdminsService: apiContext<AppOwnerMeta, AppOwnerAuth>()({
			policy: authPolicies.appOwner,
			expose: manageAdminsTopic(options),
		}),

		personalService: apiContext<UserMeta, UserAuth>()({
			policy: authPolicies.user,
			expose: personalTopic(options),
		}),
	
		userService: apiContext<AnonMeta, AnonAuth>()({
			policy: authPolicies.anon,
			expose: userTopic(options),
		}),

		permissionsService: apiContext<UserMeta, UserAuth>()({
			policy: authPolicies.userWhoManagesPermissions,
			expose: permissionsTopic(options),
		}),
	})
}
