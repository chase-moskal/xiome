
import {Question} from "../../topics/types/question.js"

export function sortQuestions(questions: Question[]) {
	return [...questions].sort((a, b) => {
		const promote = {a: -1, b: 1}

		if (a.likes > b.likes) return promote.a
		if (a.likes < b.likes) return promote.b

		if (a.reports < b.reports) return promote.a
		if (a.reports > b.reports) return promote.b

		if (a.timePosted > b.timePosted) return promote.a
		if (a.timePosted < b.timePosted) return promote.b

		return 0
	})
}
