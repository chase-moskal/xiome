
import {or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {QuestionPostRow, QuestionsTables} from "../../tables/types/questions-tables.js"
import {Question} from "../../types/question.js"

export async function resolveQuestions({userId, posts, questionsTables}: {
		userId?: string
		posts: QuestionPostRow[]
		questionsTables: QuestionsTables
	}) {

	const ids = posts.map(post => post.questionId)

	const likes = ids.length
		? await questionsTables.questionLikes.read({
			conditions: or(...ids.map(id => ({equal: {questionId: id}})))
		})
		: []

	const reports = ids.length
		? await questionsTables.questionReports.read({
			conditions: or(...ids.map(id => ({equal: {questionId: id}})))
		})
		: []

	return ids.map(id => {
		const questionPost = posts.find(post => post.questionId === id)
		const questionLikes = likes.filter(like => like.questionId === id)
		const questionReports = reports.filter(report => report.questionId === id)

		const userLike = questionLikes.find(like => like.userId === userId)
		const userReport = questionReports.find(report => report.userId === userId)

		return <Question>{
			...questionPost,
			likes: questionLikes.length,
			reports: questionReports.length,
			liked: !!userLike,
			reported: !!userReport,
		}
	})
}
