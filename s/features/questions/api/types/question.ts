
import {QuestionPostRow} from "../tables/types/questions-tables.js"

export type Question = {
	liked: boolean
	likes: number
	reports: number
	reported: boolean
} & QuestionPostRow
