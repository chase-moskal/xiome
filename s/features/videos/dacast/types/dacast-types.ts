
export interface Content {
	title: string
	online: boolean
	creation_date: string
	start_date: string
	end_date: string
}

export interface Channel extends Content {}
export interface Vod extends Content{}
export interface Playlist extends Content {}

export interface Client {
	channels: {
		get(): Promise<Channel[]>
	}
	channel(id: string): {
		get(): Promise<Channel>
	}
	vods: {
		get(): Promise<Vod[]>
	}
	vod(id: string): {
		get(): Promise<Vod>
	}
	playlists: {
		get(): Promise<Playlist[]>
	}
	playlist(id: string): {
		get(): Promise<Playlist>
	}
}

export interface MakeClient {
	({apiKey}: {
		apiKey: string
	}): Client
}

export interface VerifyApiKey {
	(apiKey: string): Promise<boolean>
}
