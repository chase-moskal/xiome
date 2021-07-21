
import {AppStats} from "./app-stats.js"

export interface AppDisplay {
	appId: string
	label: string
	home: string
	origins: string[]
	stats: AppStats
}
