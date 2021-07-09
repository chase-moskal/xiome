
import {or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {QuestionPostRow, QuestionsTables} from "../../tables/types/questions-tables.js"
import {Question} from "../../types/question.js"

export async function resolveQuestions({id_user, posts, questionsTables}: {
		id_user?: string
		posts: QuestionPostRow[]
		questionsTables: QuestionsTables
	}) {

	const ids = posts.map(post => post.id_question)

	const likes = ids.length
		? await questionsTables.questionLikes.read({
			conditions: or(...ids.map(id => ({equal: {id_question: id}})))
		})
		: []

	const reports = ids.length
		? await questionsTables.questionReports.read({
			conditions: or(...ids.map(id => ({equal: {id_question: id}})))
		})
		: []

	return ids.map(id => {
		const questionPost = posts.find(post => post.id_question === id)
		const questionLikes = likes.filter(like => like.id_question === id)
		const questionReports = reports.filter(report => report.id_question === id)

		const userLike = questionLikes.find(like => like.id_user === id_user)
		const userReport = questionReports.find(report => report.id_user === id_user)

		return <Question>{
			...questionPost,
			likes: questionLikes.length,
			reports: questionReports.length,
			liked: !!userLike,
			reported: !!userReport,
		}
	})
}
