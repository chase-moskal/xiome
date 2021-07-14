
export type Question = {
	liked: boolean
	likes: number
	reports: number
	reported: boolean

	questionId: string
	authorUserId: string
	board: string
	content: string
	archive: boolean
	timePosted: number
}
