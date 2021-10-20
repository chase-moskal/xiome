
import {Suite, expect} from "cynic"
import {sortQuestions} from "./sort-questions.js"
import {day} from "../../../../../toolbox/goodtimes/times.js"
import {Question} from "../../../api/types/questions-and-answers.js"

const now = Date.now()
const daysAgo = (x: number) => now - (x * day)

export default <Suite>{
	async "input length should equal output length"() {
		const {fakeQuestion} = fakeQuestionSession()
		const output = sortQuestions([
			fakeQuestion(),
			fakeQuestion(),
		])
		expect(output.length).equals(2)
	},
	async "liked question is promoted"() {
		const {fakeQuestion} = fakeQuestionSession()
		const output = sortQuestions([
			fakeQuestion({
				liked: false,
				likes: 0,
			}),
			fakeQuestion({
				liked: true,
				likes: 1,
			}),
		])
		expect(output[0].liked).equals(true)
	},
	async "newer question is promoted"() {
		const {fakeQuestion} = fakeQuestionSession()
		const output = sortQuestions([
			fakeQuestion({
				authorUserId: "a",
				timePosted: daysAgo(2),
			}),
			fakeQuestion({
				authorUserId: "b",
				timePosted: daysAgo(1),
			}),
		])
		expect(output[0].authorUserId).equals("b")
	},
	async "reported questions are demoted"() {
		const {fakeQuestion} = fakeQuestionSession()
		const output = sortQuestions([
			fakeQuestion({
				reported: true,
				reports: 1,
			}),
			fakeQuestion({
				reported: false,
				reports: 0,
			}),
		])
		expect(output[0].reported).equals(false)
	},
	async "questions with more reports are demoted more"() {
		const {fakeQuestion} = fakeQuestionSession()
		const output = sortQuestions([
			fakeQuestion({
				authorUserId: "a",
				reports: 2,
				reported: false,
			}),
			fakeQuestion({
				authorUserId: "b",
				reports: 1,
				reported: false,
			}),
		])
		expect(output[0].authorUserId).equals("b")
	},
	async "user's own questions are always on top"() {
		const {fakeQuestion} = fakeQuestionSession()
		const me = "me"
		const output = sortQuestions([
			fakeQuestion({
				timePosted: daysAgo(1),
				likes: 10,
				liked: true,
			}),
			fakeQuestion({
				authorUserId: me,
				timePosted: daysAgo(2),
			}),
		], me)
		expect(output[0].authorUserId).equals(me)
	},
	async "complex data 1"() {
		const {fakeQuestion} = fakeQuestionSession()
		const input: Question[] = [
			fakeQuestion({
				authorUserId: "old",
				timePosted: daysAgo(365),
				likes: 10,
				liked: true,
			}),
			fakeQuestion({
				authorUserId: "middle-a",
				timePosted: daysAgo(10),
				likes: 5,
				liked: true,
			}),
			fakeQuestion({
				authorUserId: "middle-b",
				timePosted: daysAgo(9),
			}),
			fakeQuestion({
				authorUserId: "new",
				timePosted: daysAgo(1),
			}),
		]
		return {
			async "old questions are ranked low despite likes"() {
				const output = sortQuestions(input)
				expect(output[0].authorUserId).equals("new")
			},
			async "likes can promote questions near in time"() {
				const output = sortQuestions(input)
				const getIndex = (id: string) => output.indexOf(
					output.find(q => q.authorUserId === id)
				)
				const middle_a = getIndex("middle-a")
				const middle_b = getIndex("middle-b")
				expect(middle_a < middle_b).ok()
			},
		}
	},
	"the value of likes and reports": {
		async "one like is worth one day"() {
			const {fakeQuestion} = fakeQuestionSession()
			const output = sortQuestions([
				fakeQuestion({
					authorUserId: "a",
					timePosted: daysAgo(1.1),
				}),
				fakeQuestion({
					authorUserId: "b",
					timePosted: daysAgo(2),
					likes: 1,
				}),
			])
			expect(output[0].authorUserId).equals("b")
		},
		async "a second like is worth less"() {
			const {fakeQuestion} = fakeQuestionSession()
			const output = sortQuestions([
				fakeQuestion({
					authorUserId: "a",
					timePosted: daysAgo(1.1),
				}),
				fakeQuestion({
					authorUserId: "b",
					timePosted: daysAgo(3),
					likes: 2,
				}),
			])
			expect(output[0].authorUserId).equals("a")
		},
		async "reports are more demotional than likes are promotional"() {
			const {fakeQuestion} = fakeQuestionSession()
			const output = sortQuestions([
				fakeQuestion({
					authorUserId: "a",
					timePosted: daysAgo(1.01),
				}),
				fakeQuestion({
					authorUserId: "b",
					timePosted: daysAgo(1),
					likes: 10,
					reports: 9,
				}),
			])
			expect(output[0].authorUserId).equals("a")
		},
	},
}

function fakeQuestionSession() {
	let count = 0
	return {
		fakeQuestion(changes?: Partial<Question>): Question {
			count += 1
			const standard: Question = {
				answers: [],
				archive: false,
				authorUserId: "",
				board: "default",
				content: "Hello this is a question!",
				liked: false,
				likes: 0,
				questionId: "",
				reported: false,
				reports: 0,
				timePosted: Date.now(),
			}
			const question = {...standard, ...changes}
			question.timePosted -= count
			return question
		}
	}
}
