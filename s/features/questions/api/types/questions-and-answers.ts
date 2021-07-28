
export type Question = {
	questionId: string
	authorUserId: string
	board: string
	content: string
	archive: boolean
	timePosted: number
	answers: Answer[]
} & Likeable & Reportable

export type Answer = {
	answerId: string
	questionId: string
	authorUserId: string
	content: string
	archive: boolean
	timePosted: number
} & Likeable & Reportable

export type Likeable = {
	liked: boolean
	likes: number
}

export type Reportable = {
	reports: number
	reported: boolean
}
