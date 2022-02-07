
import {Await} from "../../../types/await.js"
import {mockConnectApp} from "../connect/mock/mock-connect-app.js"
import {prepareMockActions} from "../mocks/prepare-mock-actions.js"

export async function demoQuestions({appOrigin, connection}: {
		appOrigin: string,
		connection: Await<ReturnType<typeof mockConnectApp>>
	}) {

	const {asMockPerson} = await prepareMockActions({appOrigin, connection})
	let questionId: string
	await asMockPerson("a@xiome.io", async tab => {
		const boardModel = tab.models.questionsModel.makeBoardModel("default")
		const question = await boardModel.postQuestion({
			content: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
		})
		questionId = question.questionId
		await boardModel.likeQuestion(questionId, true)
	})
	await asMockPerson("creative@xiome.io", async tab => {
		const boardModel = tab.models.questionsModel.makeBoardModel("default")
		await boardModel.loadQuestions()
		await boardModel.likeQuestion(questionId, true)
		await boardModel.postAnswer(questionId, {
			content: "Researchers say,\nApproximately 700 pounds of wood.",
		})
	})
}
