
import {DacastData} from "./dacast-data.js"

export namespace Dacast {

	export interface Paginated<xData extends DacastData.Common> {
		data?: xData[]
		paging: {
			self?: string
			last?: string
			next?: string
			previous?: string
		}
		totalCount: string
	}

	export type EmbedType =
		| "javascript"
		| "iframe"

	export interface Embed {
		code: string
	}

	export interface Client {
		channels: {
			get(): Promise<Paginated<DacastData.Channel>>
			id(channelId: string): {
				get(): Promise<DacastData.Channel>
				embed(embedType: EmbedType): {
					get(): Promise<Embed>
				}
			}
		}
		vods: {
			get(): Promise<Paginated<DacastData.Vod>>
			id(vodId: string): {
				get(): Promise<DacastData.Vod>
				embed(embedType: EmbedType): {
					get(): Promise<Embed>
				}
			}
		}
		playlists: {
			get(): Promise<Paginated<DacastData.Playlist>>
			id(playlistId: string): {
				get(): Promise<DacastData.Playlist>
				embed(embedType: EmbedType): {
					get(): Promise<Embed>
				}
			}
		}
	}

	export interface Headers {
		"X-Api-Key": string
		"X-Format": "default"
	}

	export interface MakeClient {
		({}: {
			apiKey: string
			headers?: Partial<Headers>
		}): Client
	}

	export type GetClient = (apiKey: string) => Client

	export interface VerifyApiKey {
		(apiKey: string): Promise<boolean>
	}

	export interface Sdk {
		getClient: GetClient
		verifyApiKey: VerifyApiKey
	}
}
