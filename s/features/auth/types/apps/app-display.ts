
import {AppStats} from "./app-stats.js"

export interface AppDisplay {
	id_app: string
	label: string
	home: string
	origins: string[]
	stats: AppStats
}
