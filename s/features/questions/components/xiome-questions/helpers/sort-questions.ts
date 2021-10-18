
import {Question} from "../../../api/types/questions-and-answers.js"

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

	function sortingFunction(a: Question, b: Question) {
		const promoteA = -1
		const promoteB = 1

		if (a.likes > b.likes) return promoteA
		if (a.likes < b.likes) return promoteB

		if (a.reports < b.reports) return promoteA
		if (a.reports > b.reports) return promoteB

		if (a.timePosted > b.timePosted) return promoteA
		if (a.timePosted < b.timePosted) return promoteB

		return 0
	}

	return [
		...myQuestions.sort(sortingFunction),
		...otherQuestions.sort(sortingFunction),
	]
}
