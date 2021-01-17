
import {ToRemote} from "renraku/x/types/remote/to-remote.js"

import {Await} from "../types.js"
import {AuthOptions, AuthTables} from "../features/auth/auth-types.js"

import {assembleApi} from "./assemble-api.js"
import {assembleFrontend} from "./assemble-frontend.js"

export type SystemTables = {
	auth: AuthTables
}

export type SystemApi = Await<ReturnType<typeof assembleApi>>
export type SystemRemote = ToRemote<SystemApi>

export interface ApiOptions extends AuthOptions {
	tables: SystemTables
}

export type FrontendSystems = Await<ReturnType<typeof assembleFrontend>>
