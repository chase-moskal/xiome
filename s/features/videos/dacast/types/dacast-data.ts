
export namespace DacastData {

	export type ContentType = 
		| "vod"
		| "channel"
		| "playlist"

	export interface Picture {
		splashscreen: string[]
		thumbnail: string[]
	}

	export interface Common {
		id: string
		title: string
		online: boolean
		creation_date: string

		pictures?: Picture[]
		ads?: any
		autoplay?: boolean
	}

	interface VodAndChannel {
		category_id: number
		associated_packages?: string
		share_code: {
			facebook: string
			gplus: string
			twitter: string
		}
	}

	interface ChannelAndPlaylist {
		company_url: string
		countdown_date: string
		countdown_timezone: string
		counter_live_limit: number
		theme_id: string
	}

	export interface Playlist extends Common, ChannelAndPlaylist {
		contents: {
			id: string
			title: string
			position: number
			thumbnail_id: string
		}[]
	}

	export interface Channel extends Common, VodAndChannel, ChannelAndPlaylist {
		config: any
		stream_tech: string
		rtmp?: any
		schedule?: any
		web_dvr?: number
	}

	export interface Vod extends Common, VodAndChannel {
		abitrate?: number
		acodec?: string
		container?: string
		countries_id?: string
		custom_data?: string
		description?: string
		disk_usage?: number
		duration?: string
		enable_coupon?: boolean
		enable_payperview?: boolean
		enable_subscription?: boolean
		external_video_page?: string
		filename?: string
		filesize?: string
		google_analytics?: number
		group_id?: number
		hds?: string
		hls?: string
		is_secured?: boolean
		noframe_security?: number
		original_id?: string
		password?: string
		player_height?: number
		player_width?: number
		publish_on_dacast?: boolean
		referers_id?: string
		save_date?: string
		splashscreen_id?: number
		streamable?: number
		subtitles?: any
		template_id?: number
		thumbnail_id?: number
		vbitrate?: number
		vcodec?: string
		video_height?: number
		video_width?: number
	}
}
