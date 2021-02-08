
import {SignToken, VerifyToken} from "redcrypto/dist/types.js"

import {makeAuthApi} from "./auth-api.js"
import {Rando} from "../../toolbox/get-rando.js"
import {DbbyRow, DbbyTable} from "../../toolbox/dbby/dbby-types.js"

export * from "redcrypto/dist/types.js"

export interface PlatformConfig {
	mongo: {
		link: string
		database: string
	}
	google: {
		clientId: string
	}
	platform: {
		appDetails: {
			appId: string
			label: string
			home: string
			origins: string[]
		}
		from: string
		technician: {
			email: string
		}
	}
	permissions: {
		app: HardPermissions
		platform: HardPermissions
	}
	tokens: {
		expiryRenewalCushion: number
		lifespans: {
			app: number
			login: number
			access: number
			refresh: number
			external: number
		}
	}
	stripe: {
		apiKey: string
		secret: string
		webhookSecret: string
	}
}

export interface AuthOptions {
	rando: Rando
	config: PlatformConfig
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
}

export interface AnonMeta {
	appToken: AppToken
}

export interface AnonAuth {
	app: App
	tables: AuthTables
}

export interface UserMeta extends AnonMeta {
	accessToken: AccessToken
}

export interface UserAuth extends AnonAuth {
	access: AccessPayload
}

export interface PlatformUserMeta extends UserMeta {}

export interface PlatformUserAuth extends UserAuth {}

export interface HardPermissionsBlueprint {
	inherit?: HardPermissions
	privileges: {[label: string]: string}
	roles: {[label: string]: {
		roleId: string
		privileges: string[]
	}}
}

export type HardPermissions = {
	roles: RoleRow[]
	privileges: PrivilegeRow[]
	userHasRoles: UserHasRoleRow[]
	roleHasPrivileges: RoleHasPrivilegeRow[]
}

export type Tables = {[key: string]: DbbyTable<DbbyRow>}

export type GetTables<T extends Tables> = ({}: {appId: string}) => T

export type AuthProcessorPreparations<T extends Tables> = {
	getTables: GetTables<T>
	verifyToken: VerifyToken
}

export interface EmailDetails {
	to: string
	subject: string
	body: string
}

export interface LoginEmailDetails {
	to: string
	appHome: string
	appLabel: string
	lifespan: number
	loginToken: string
	platformLink: string
}

export type SendEmail = ({}: EmailDetails) => Promise<void>
export type SendLoginEmail = ({}: LoginEmailDetails) => Promise<void>

// api
//

export type AuthApi = ReturnType<typeof makeAuthApi>

// auth types
//

export type User = {
	userId: string
	profile: Profile
	roles: PublicUserRole[]
	stats: {
		joined: number
	}
}

export type Permit = {
	privileges: string[]
}

export type Profile = {
	nickname: string
	tagline: string
	avatar: string
}

export type PublicUserRole = {
	roleId: string
	label: string
	timeframeStart: number
	timeframeEnd: number
}

export type UserStats = {
	joined: number
}

export type Settings = {
	actAsAdmin: boolean
}

export type AuthContext = {
	user: User
	exp: number
	accessToken: AccessToken
}

export type GetAuthContext = () => Promise<AuthContext>

export interface AuthPayload {
	user: User
	getAuthContext: GetAuthContext
}

export type DecodeAccessToken = (accessToken: AccessToken) => AuthContext

export type TriggerAccountPopup = () => Promise<AuthTokens>
export type TriggerCheckoutPopup = (o: {stripeSessionId: string}) => Promise<void>

export interface GoogleResult {
	name: string
	avatar: string
	googleId: string
}

export type VerifyGoogleToken = (googleToken: string) => Promise<GoogleResult>

// tokens
//

// app tokens

export type AppToken = string

export interface App {
	appId: string
	origins: string[]
	permissions: any
	platform: boolean
}

// export type AppToken = string

// export interface AppTokenDraft {
// 	appId: string
// 	label: string
// 	origins: string[]
// }

// export interface AppPayload {
// 	appId: string
// 	origins: string[]
// 	platform?: boolean
// }

//

export type LoginToken = string
export type AccessToken = string
export type RefreshToken = string

export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}

export interface Scope {
	core?: boolean
}

export type LoginPayload = {
	userId: string
}

export interface AppDraft {
	label: string
	home: string
	origins: string[]
}

export interface AccessPayload {
	user: User
	scope: Scope
	permit: Permit
}

export interface RefreshPayload {
	userId: string
}

export interface TokenData<Payload> {
	iat: any
	exp: any
	payload: Payload
}

export type VerifyRefreshToken = (
		refreshToken: RefreshToken
	) => Promise<RefreshPayload>

export type VerifyAccessToken = (
		accessToken: AccessToken
	) => Promise<AccessPayload>

export type Authorizer = (
		accessToken: AccessToken
	) => Promise<User>

// database rows
//

export type PermissionsTables = {
	role: DbbyTable<RoleRow>
	privilege: DbbyTable<PrivilegeRow>
	userHasRole: DbbyTable<UserHasRoleRow>
	roleHasPrivilege: DbbyTable<RoleHasPrivilegeRow>
}

export type AuthTables = PermissionsTables & {
	account: DbbyTable<AccountRow>
	accountViaEmail: DbbyTable<AccountViaEmailRow>
	accountViaGoogle: DbbyTable<AccountViaGoogleRow>
	profile: DbbyTable<ProfileRow>
	app: DbbyTable<AppRow>
	appToken: DbbyTable<AppTokenRow>
	appOwnership: DbbyTable<AppOwnershipRow>
}

export type AppRow = {
	appId: string
	label: string
	home: string
	origins: string
	archived: boolean
}

export type AppOwnershipRow = {
	appId: string
	userId: string
}

export type AppTokenRow = {
	appToken: string
	appId: string
	label: string
	expiry: number
	origins: string
	appTokenId: string
}

export type AccountRow = {
	userId: string
	created: number
}

export type AccountViaEmailRow = {
	userId: string
	email: string
}

export type AccountViaGoogleRow = {
	userId: string
	googleId: string
	googleAvatar: string
}

export type AccountViaSignatureRow = {
	userId: string
	publicKey: string
}

export type ProfileRow = {
	userId: string
	nickname: string
	tagline: string
	avatar: string
}

export type SettingsRow = {
	actAsAdmin: boolean
}

// roles and permissions
//

export type RoleRow = {
	roleId: string
	label: string
}

export type PrivilegeRow = {
	privilegeId: string
	label: string
}

export type UserHasRoleRow = {
	userId: string
	roleId: string
	timeframeStart: number
	timeframeEnd: number
	public: boolean
}

export type RoleHasPrivilegeRow = {
	roleId: string
	privilegeId: string
}
