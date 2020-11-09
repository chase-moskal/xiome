
import {makeCoreApi} from "./core-api.js"
import {makeTokenStore} from "./token-store.js"
import {DbbyTable} from "../../toolbox/dbby/dbby-types.js"

export * from "redcrypto/dist/types.js"

export interface PlatformConfig {
	platformApp: AppPayload & {root: true}
	mongo: {
		link: string
		database: string
	}
	google: {
		clientId: string
	}
	tokens: {
		lifespans: {
			app: number
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

// api topics
//

export type CoreApi = ReturnType<typeof makeCoreApi>
export type TokenStoreTopic = ReturnType<typeof makeTokenStore>

// auth types
//

export type User = {
	userId: string
	profile: Profile
	tags: string[]
}

export type Profile = {
	userId: string
	nickname: string
	tagline: string
	avatar: string
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

export type AppToken = string
export type AccessToken = string
export type RefreshToken = string

export interface AuthTokens {
	accessToken: AccessToken
	refreshToken: RefreshToken
}

export interface Scope {
	core?: boolean
}

export interface AppPayload {
	appId: string
	origins: string[]
	root?: boolean
}

export interface AccessPayload {
	user: User
	scope: Scope
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

export type CoreTables = {
	account: DbbyTable<AccountRow>
	accountViaGoogle: DbbyTable<AccountViaGoogleRow>
	accountViaPasskey: DbbyTable<AccountViaPasskeyRow>
}

export type AccountRow = {
	userId: string
	created: number
}

export type AccountViaGoogleRow = {
	userId: string
	googleId: string
	googleAvatar: string
}

export type AccountViaPasskeyRow = {
	userId: string
	digest: string
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

// user has roles
export type UserRoleRow = {
	userId: string
	roleId: string
}

// role has privileges
export type RolePrivilegeRow = {
	privilegeId: string
	roleId: string
	label: string
}
