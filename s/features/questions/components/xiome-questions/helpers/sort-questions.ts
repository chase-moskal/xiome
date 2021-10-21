
import {day} from "../../../../../toolbox/goodtimes/times.js"
import {Question} from "../../../api/types/questions-and-answers.js"

const timeFactor = 1 * day

export function sortQuestions(questions: Question[], myUserId?: string) {
	const myQuestions: Question[] = []
	const otherQuestions: Question[] = []

	for (const question of questions) {
		const isMine = myUserId && question.authorUserId === myUserId
		if (isMine)
			myQuestions.push(question)
		else
			otherQuestions.push(question)
	}

	return [
		...myQuestions.sort(compareQuestions),
		...otherQuestions.sort(compareQuestions),
	]
}

function compareQuestions(a: Question, b: Question) {
	const promoteA = -1
	const promoteB = 1

	const scoreA = score(a)
	const scoreB = score(b)

	if (scoreA > scoreB) return promoteA
	if (scoreB < scoreA) return promoteB

	return 0
}

function score({timePosted, likes, reports}: {
		timePosted: number
		likes: number
		reports: number
	}) {
	return timePosted
		+ voteValue(likes, timeFactor)
		- voteValue(reports, 2 * timeFactor)
}

function voteValue(votes: number, timeFactor: number) {
	const voteWeight = votes === 0
		? 0
		: 1 + Math.log10(votes)
	return voteWeight * timeFactor
}
