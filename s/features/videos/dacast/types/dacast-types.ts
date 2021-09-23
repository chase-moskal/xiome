import * as rm from 'typed-rest-client/RestClient';

export interface Content {
	title: string
	online: boolean
	creation_date: string
	start_date: string
	end_date: string
}

export enum ContentType {
	Channel,
	Vod,
	Playlist,
}

export interface Channel extends Content {}
export interface Vod extends Content{}
export interface Playlist extends Content {}
export interface Embed {
	iframeEmbed: string
	javascriptEmbed: string
}

export interface Client {
	channels: {
		get(): Promise<Channel[]>
		post(channel: any): Promise<Channel>
		id(channelId: string): {
			delete(): Promise<unknown>
			get(): Promise<Channel>
			put(): Promise<Channel>
			embed(embedType: string): {
				get(): Promise<Embed>
			}
			deleteSplash(): Promise<unknown>
			deleteThumbnail(): Promise<unknown>
			postSplash(): Promise<Channel>
			postThumbnail(): Promise<Channel>
		}
	}
	vods: {
		get(): Promise<Vod[]>
		post(vod: any): Promise<Vod>
		id(vodId: string): {
			delete(): Promise<unknown>
			get(): Promise<Vod>
			put(vod: any): Promise<Vod>
			embed(embedType: string): {
				get(): Promise<Embed>
			}
			deleteSplash(): Promise<unknown>
			postSplash(splash: any): Promise<Vod>
			postThumbnail(thumbnail: any): Promise<Vod>
		}
	}
	playlists: {
		get(): Promise<Playlist[]>
		post(playlist: any): Promise<Channel>
		id(playlistId: string): {
			delete(): Promise<unknown>
			get(): Promise<Playlist>
			put(playlist: any): Promise<Playlist>
			putContent(content: any): Promise<Playlist>
			embed(embedType: string): {
				get(): Promise<Embed>
			}
			deleteSplash(): Promise<unknown>
			deleteThumbnail(): Promise<unknown>
			postSplash(splash: any): Promise<Playlist>
			postThumbnail(thumbnail: any): Promise<Playlist>
		}
	}
}

export interface MakeClient {
	(
		apiKey: string,
		options?: rm.IRequestOptions
	): Client
}

export interface VerifyApiKey {
	(apiKey: string): Promise<boolean>
}
