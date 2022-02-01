
import {snapstate} from "@chasemoskal/snapstate"

import {merge} from "../../../../toolbox/merge.js"
import {Op, ops} from "../../../../framework/ops.js"
import {User} from "../../../auth/aspects/users/types/user.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {Answer, Question} from "../../api/types/questions-and-answers.js"

export function makeQuestionsModelHappy() {
	const adminstate = snapstate({
		access: <AccessPayload>undefined,
		users: <User[]>[],
		questions: <Question[]>[],
		boardOps: <{[key: string]: Op<void>}>{},
		postingOp: <Op<void>>ops.ready(undefined),
	})

	const state = adminstate.writable

	const actions = {
		setAccess(access: AccessPayload) {
			state.access = access
		},
		setBoardOp(board: string, op: Op<void>) {
			state.boardOps = {...state.boardOps, [board]: op}
		},
		setPostingOp(op: Op<void>) {
			state.postingOp = op
		},
		addUsers(newUsers: User[]) {
			state.users = [...merge<User>(
				newUsers.filter(u => !!u),
				state.users,
				(a, b) => a.userId === b.userId,
			)]
		},
		addQuestions(newQuestions: Question[]) {
			state.questions = [...merge<Question>(
				newQuestions,
				state.questions,
				(a, b) => a.questionId === b.questionId,
			)]
		},
		addAnswer(newAnswer: Answer) {
			const question = state.questions
				.find(q => q.questionId === newAnswer.questionId)
			if (!question)
				throw new Error(`can't find question to add answer, question id: "${newAnswer.questionId}"`)
			const newQuestion: Question = {
				...question,
				answers: [...question.answers, newAnswer],
			}
			state.questions = [...merge<Question>(
				[newQuestion],
				state.questions,
				(a, b) => a.questionId === b.questionId,
			)]
		},
		setQuestionLike(questionId: string, like: boolean) {
			state.questions = state.questions.map(question =>
				question.questionId === questionId
					? {
						...question,
						liked: like,
						likes: question.liked === like
							? question.likes
							: like
								? question.likes + 1
								: question.likes - 1
					}
					: {...question}
			)
		},
		setAnswerLike(questionId: string, answerId: string, status: boolean) {
			state.questions = state.questions.map(question =>
				question.questionId === questionId
					? {
						...question,
						answers: question.answers.map(answer =>
							answer.answerId === answerId
								? {
									...answer,
									liked: status,
									likes: answer.liked === status
										? answer.likes
										: status
											? answer.likes + 1
											: answer.likes - 1
								}
								: {...answer}
						)
					}
					: {...question}
			)
		},
		setAnswerReport(questionId: string, answerId: string, status: boolean) {
			state.questions = state.questions.map(question =>
				question.questionId === questionId
					? {
						...question,
						answers: question.answers.map(answer =>
							answer.answerId === answerId
								? {
									...answer,
									reported: status,
									reports: answer.reported === status
										? answer.reports
										: status
											? answer.reports + 1
											: answer.reports - 1
								}
								: {...answer}
						)
					}
					: {...question}
			)
		},
		setQuestionReport(questionId: string, report: boolean) {
			state.questions = state.questions.map(question =>
				question.questionId === questionId
					? {
						...question,
						reported: report,
						reports: question.reported === report
							? question.reports
							: report
								? question.reports + 1
								: question.reports - 1
					}
					: {...question}
			)
		},
		setQuestionArchive(questionId: string, archive: boolean) {
			state.questions = state.questions.map(question =>
				question.questionId === questionId
					? {...question, archive}
					: {...question}
			)
		},
		setAnswerArchive(questionId: string, answerId: string, archive: boolean) {
			state.questions = state.questions.map(question =>
				question.questionId === questionId
					? {
						...question,
						answers: question.answers.map(answer =>
							answer.answerId === answerId
								? {...answer, archive}
								: {...answer}
						)
					}
					: {...question}
			)
		},
	}

	return {
		actions,
		state: adminstate.readable,
		subscribe: adminstate.subscribe,
	}
}
