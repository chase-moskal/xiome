
import {Suite, expect} from "cynic"
import {makeCoreApi} from "./features/core/core-api.js"

import dbby from "./toolbox/dbby/dbby.test.js"

export default <Suite>{
	"user stories": {
		"dev launches the system, makes an app, login and out": true,
		"meta-user signs into meta-app and registers an app, login and out": true,
		"anon user fetches questions": true,
		"user signs up, customizes profile, and posts a question": true,
		"user logs in, buys premium subscription, views live show": true,
		"user logs in, does not have premium, and is unable to view live show": true,
	},
	"feature business logic": {
		"core": {
			"auth": {
				"users can sign up": {
					"via passkey": async() => {
						return true
						// const {apis} = await mockSystemAlpha()
						// const result = await apis.core.auth.authenticateViaPasskey()
						// return true
						// 	&& expect(result.accessToken).ok()
					},
					"via google": async() => {
						return true
						// const {apis} = await mockSystemAlpha()
						// const result = await apis.core.auth.authenticateViaGoogle()
						// return true
						// 	&& expect(result.accessToken).ok()
					},
				},
				"users can login": true,
				"users can logout": true,
				"users can obtain scoped tokens for 3rd party services": true,
				"devs can easily curry auth into any topic": true,
			},
			"apps": {
				"preconfigured meta-admin can login to meta-app": async() => {
					return true
					// const {apis} = await mockSystemAlpha()
					// const result_passkey = await apis.core.auth.authenticateViaPasskey()
					// const result_google = await apis.core.auth.authenticateViaGoogle()
					// return true
					// 	&& expect(result_passkey.accessToken).ok()
					// 	&& expect(result_google.accessToken).ok()
				},
				"meta-users can login to the meta-app": true,
				"meta-users can manage their own apps as owners": true,
				"app-owners can generate app tokens": true,
				"app-owners can generate admin accounts and login": true,
				"apps are isolated from external perspective": true,
			},
			"profiles": {
				"anybody can read any profile": true,
				"users can author their profile": true,
				"admins can overwrite any profile": true,
			},
			"permissions": {
				"hard-coded standard permissions include admin and ban": true,
				"admins can manage roles for users and permissions for roles": true,
				"admins can assign roles to users with expiry times": true,
			},
			"settings": {
				"users can access their own settings, but nobody else's": true,
				"admins can access anybody's settings": true,
			},
			"admin": {
				"stats": {
					"privileged users can view stats": true,
				},
				"bans": {
					"standard ban role assigns a banishment permission": true,
				},
			},
		},
		"payments": {
			"admins can manage subscription products": true,
			"admins can manage digital products for sale": true,
			"admins can assign privileges to product holders": true,
			"users can buy a product to obtain privileges": true,
			"users can cancel or upgrade active subscriptions": true,
			"users obtain a product token to prove what they own": true,
		},
		"media": {
			"admins can manage a library of media items (vimeo videos)": true,
			"admins can set role-based access on media items": true,
			"users with privileged roles can access media items": true,
			"*payments integration": {
				"admins can set product-token-based access on media items": true,
			},
		},
		"cms": {
			"anybody can read a content block": true,
			"admins can write a content block": true,
		},
		"questions": {
			"anybody can fetch any questions board": true,
			"privileged users can post questions": true,
			"users can delete their own questions": true,
			"admins can delete any question": true,
			"admins can purge a whole board": true,
			"users can 'like' any question": true,
			"users can 'report' any question": true,
			"admins can wipe reports on a question": true,
		},
		"schedule": {
			"anybody can read any schedule": true,
			"admins can write any schedule": true,
		},
	},
	dbby,
}
