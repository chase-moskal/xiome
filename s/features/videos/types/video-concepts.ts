
import {PrivilegeDisplay} from "../../auth/aspects/users/routines/permissions/types/privilege-display.js"
import {DacastData} from "../dacast/types/dacast-data.js"

export namespace VideoHosting {
	export type Provider = "dacast"
	export interface Base {
		provider: Provider
	}

	export interface DacastReference extends Base {
		provider: "dacast"
		type: DacastData.ContentType
		id: string
	}
	export interface DacastContent extends DacastReference {
		thumb: string
		title: string
	}
	export interface DacastEmbed extends DacastContent {
		embed: string
	}
	export type AnyReference = DacastReference
	export type AnyContent = DacastContent
	export type AnyEmbed = DacastEmbed
}

export interface VideoView {
	label: string
	privileges: string[]
	reference?: VideoHosting.AnyReference
}

export type VideoStatus = "available" | "unavailable" | "unprivileged"

export interface VideoShow {
	label: string
	status: VideoStatus
	details?: VideoHosting.AnyEmbed
}

export interface VideoModerationData {
	views: VideoView[]
	catalog: VideoHosting.AnyContent[]
	privileges: PrivilegeDisplay[]
}
