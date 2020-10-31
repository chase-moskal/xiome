
import {Suite, expect} from "cynic"
import dbby from "./toolbox/dbby/dbby.test.js"
import core from "./features/core/core.test.js"

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
		core,
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
