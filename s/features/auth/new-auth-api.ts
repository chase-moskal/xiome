
import {asApi} from "renraku/x/identities/as-api.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {appTopic} from "./topics2/app-topic.js"
import {userTopic} from "./topics2/user-topic.js"
import {loginTopic} from "./topics2/login-topic.js"
import {personalTopic} from "./topics2/personal-topic.js"
import {preparePolicies} from "./policies/prepare-auth-policies.js"
import {AnonMeta, AnonAuth, UserMeta, UserAuth, PlatformUserMeta, PlatformUserAuth, AuthOptions} from "./auth-types.js"

export const makeAuthApi = ({options, policies}: {
		options: AuthOptions
		policies: ReturnType<typeof preparePolicies>
	}) => asApi({

	login: apiContext<AnonMeta, AnonAuth>()({
		policy: policies.anon,
		expose: loginTopic(options),
	}),

	app: apiContext<PlatformUserMeta, PlatformUserAuth>()({
		policy: policies.platformUser,
		expose: appTopic(options),
	}),

	personal: apiContext<UserMeta, UserAuth>()({
		policy: policies.user,
		expose: personalTopic(options),
	}),

	user: apiContext<UserMeta, UserAuth>()({
		policy: policies.user,
		expose: userTopic(options),
	}),
})
