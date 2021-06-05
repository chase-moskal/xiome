
import {Question} from "../../api/types/question.js"

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

	const sort = (a: Question, b: Question) => {
		const promote = {a: -1, b: 1}

		if (a.likes > b.likes) return promote.a
		if (a.likes < b.likes) return promote.b

		if (a.reports < b.reports) return promote.a
		if (a.reports > b.reports) return promote.b

		if (a.timePosted > b.timePosted) return promote.a
		if (a.timePosted < b.timePosted) return promote.b

		return 0
	}

	return [
		...myQuestions.sort(sort),
		...otherQuestions.sort(sort),
	]
}
