
import * as dbmage from "dbmage"
import * as renraku from "renraku"
import {mockSignToken} from "redcrypto/x/curries/mock-sign-token.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {makeAuthMediator} from "../mediator/auth-mediator.js"
import {mockMeta} from "../../../common/testing/mock-meta.js"
import {mockAccess} from "../../../common/testing/mock-access.js"
import {makeAccessModel} from "../aspects/users/models/access-model.js"
import {makeGreenService} from "../aspects/users/services/green-service.js"
import {makeLoginService} from "../aspects/users/services/login-service.js"
import {prepareMockAuth} from "../../../common/testing/prepare-mock-auth.js"
import {mockSendLoginEmail} from "../../../assembly/backend/tools/mock-send-login-email.js"
import {standardNicknameGenerator} from "../utils/nicknames/standard-nickname-generator.js"
import {platformPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {UserHasRoleRow} from "../aspects/permissions/types/permissions-tables.js"

export async function authTestSetup() {
	const mockAuth = await prepareMockAuth()
	const {
		appId,
		rando,
		config,
		storage,
		appOrigin,
		authPolicies,
		database,
	} = mockAuth

	const {fakeSendLoginEmail, getLatestLoginEmail}
		= mockSendLoginEmail(async() => {})

	const authOptions = {
		rando,
		config,
		authPolicies,
		generateNickname: standardNicknameGenerator({rando}),
		sendLoginEmail: fakeSendLoginEmail,
		signToken: mockSignToken(),
		verifyToken: mockVerifyToken(),
	}

	const getHeaders = async() => ({origin: appOrigin})

	const greenService = renraku.mock()
		.forService(makeGreenService(authOptions))
		.withMeta(async() => mockMeta({
			access: mockAccess({
				appId,
				rando,
				appOrigin,
				privileges: [
					platformPermissions.privileges["edit any app"],
					platformPermissions.privileges["view platform stats"],
				],
			}),
		}), getHeaders)

	const loginService = renraku.mock()
		.forService(makeLoginService(authOptions))
		.withMeta(async() => mockMeta({
			access: mockAccess({
				appId,
				rando,
				appOrigin,
				privileges: [],
			}),
		}), getHeaders)

	return {
		...mockAuth,
		async createRole(label: string, privilegeIds: string[]) {
			const roleId = rando.randomId()
			await database.tables.auth.permissions.role.create({
				assignable: true,
				hard: true,
				label,
				public: true,
				roleId,
				time: Date.now(),
			})
			for (const privilegeId of privilegeIds) {
				await database.tables.auth.permissions.roleHasPrivilege.create({
					active: true,
					immutable: false,
					privilegeId: dbmage.Id.fromString(privilegeId),
					roleId,
					time: Date.now(),
				})
			}
			return roleId.string
		},
		async makeClient(...roleIds: string[]) {
			const email = `${rando.randomId().string}@xiome.io`

			const authMediator = makeAuthMediator({
				appId: appId.string,
				storage,
				greenService,
			})
			const accessModel = makeAccessModel({
				authMediator,
				loginService,
			})

			async function logBackIn() {
				await accessModel.sendLoginLink(email)
				const {loginToken} = getLatestLoginEmail()
				await accessModel.login(loginToken)
			}

			await logBackIn()

			const userId = accessModel.getAccess().user.userId
			if (roleIds.length > 0) {
				await database.tables.auth.permissions.userHasRole.create(
					...roleIds.map(roleId => (<UserHasRoleRow>{
						hard: true,
						public: true,
						time: Date.now(),
						roleId: dbmage.Id.fromString(roleId),
						userId: dbmage.Id.fromString(userId),
						timeframeEnd: undefined,
						timeframeStart: undefined,
					}))
				)
				await accessModel.reauthorize()
			}
			return {
				accessModel,
				authMediator,
				logBackIn,
			}
		},
	}
}
