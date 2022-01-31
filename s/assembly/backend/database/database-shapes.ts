
import * as dbmage from "dbmage"
import {DatabaseSchema, DatabaseSchemaRequiresAppIsolation, DatabaseSchemaUnisolated} from "../types/database.js"

export const databaseShapeUnisolated:
	dbmage.SchemaToShape<DatabaseSchemaUnisolated> = {
	apps: {
		registrations: true,
		owners: true,
	},
}

export const databaseShapeRequiresAppIsolation:
	dbmage.SchemaToShape<DatabaseSchemaRequiresAppIsolation> = {
	auth: {
		users: {
			accounts: true,
			emails: true,
			latestLogins: true,
			profiles: true,
		},
		permissions: {
			privilege: true,
			role: true,
			roleHasPrivilege: true,
			userHasRole: true,
		},
	},
	example: {
		examplePosts: true,
	},
	questions: {
		likes: true,
		reports: true,
		answerPosts: true,
		questionPosts: true,
	},
	store: {
		// TODO store
		// billing: {
		// 	customers: true,
		// 	storeInfo: true,
		// 	subscriptionPlans: true,
		// 	subscriptions: true,
		// },
		merchants: {
			stripeAccounts: true,
		},
		subscriptions: {
			plans: true,
			tiers: true,
		},
	},
	videos: {
		dacastAccountLinks: true,
		viewDacast: true,
		viewPrivileges: true,
	},
	notes: {
		notes: true,
		questionDetails: true,
	},
}

export const databaseShape: dbmage.SchemaToShape<DatabaseSchema> = {
	...databaseShapeRequiresAppIsolation,
	...databaseShapeUnisolated,
}
