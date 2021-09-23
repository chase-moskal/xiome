
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
		id(channelId: string): {
			get(): Promise<Channel>
			embed(embedType: string): {
				get(): Promise<Embed>
			}
		}
	}
	vods: {
		get(): Promise<Vod[]>
		id(vodId: string): {
			get(): Promise<Vod>
			embed(embedType: string): {
				get(): Promise<Embed>
			}
		}
	}
	playlists: {
		get(): Promise<Playlist[]>
		id(playlistId: string): {
			get(): Promise<Playlist>
			embed(embedType: string): {
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

export interface VerifyApiKey {
	(apiKey: string): Promise<boolean>
}
