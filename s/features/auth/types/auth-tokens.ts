
import {User} from "../aspects/users/types/user.js"
import {Permit} from "../aspects/permissions/types/permit.js"

export interface AuthTokens {
	accessToken: string
	refreshToken: string
}

export interface AccessPayload {
	appId: string
	origins: string[]
	user: User | undefined
	scope: Scope
	permit: Permit
}

export interface RefreshPayload {
	userId: string
}

export interface LoginPayload {
	userId: string
}

export interface CoreScope {
	core: boolean
}

export type Scope = CoreScope

export type VerifyAccessToken = (accessToken: string) => Promise<AccessPayload>
export type VerifyRefreshToken = (refreshToken: string) => Promise<RefreshPayload>
