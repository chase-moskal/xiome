
import * as Dacast from "../dacast/types/dacast-types.js"

export type GetDacastClient = (apiKey: string) => Dacast.Client

export namespace VideoHosting {
	export type Provider = "dacast"
	export interface Base {
		provider: Provider
	}
	export type DacastType = 
		| "vod"
		| "channel"
		| "playlist"
	export interface DacastReference extends Base {
		provider: "dacast"
		type: DacastType
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

export interface VideoView extends VideoHosting.AnyReference {
	label: string
	privileges: string[]
}

export interface VideoShow extends VideoHosting.AnyEmbed {
	label: string
}
