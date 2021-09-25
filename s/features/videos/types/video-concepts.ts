
// export namespace VideoHosting {
// 	export type Provider = "dacast"
// 	export interface Base {
// 		provider: Provider
// 	}
// 	export type DacastType = 
// 		| "vod"
// 		| "channel"
// 		| "playlist"
// 	export interface DacastReference extends Base {
// 		provider: "dacast"
// 		type: DacastType
// 		id: string
// 	}
// 	export interface DacastContent extends DacastReference {
// 		thumb: string
// 		title: string
// 		embed: string
// 	}
// 	export type AnyReference = DacastReference
// 	export type AnyContent = DacastContent
// }

export type DacastType = 
	| "vod"
	| "channel"
	| "playlist"

export namespace VideoCatalogItem {
	export type Provider = "dacast"
	export interface Base {
		id: string
		thumb: string
		title: string
		provider: Provider
	}
	export interface Dacast extends Base {
		provider: "dacast"
		type: DacastType
	}
	export type Any = Dacast
}

export interface VideoView {
	label: string
	privileges: string[]

}

export interface VideoShow {
	label: string
	embed: string
}
